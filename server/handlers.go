package server

import (
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"strconv"

	"github.com/japaudio/JapALP/db"

	"github.com/gin-gonic/gin"
)

func homePage(c *gin.Context) {
	c.String(http.StatusOK, "Hello jpAlp")
}

func translateTextHandler(c *gin.Context) {
	detectedLanguage := "ja"
	textData := c.Param("text")
	fmt.Printf("Input text: %v", textData)
	translatedText, err := translateText(detectedLanguage, textData)
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}
	c.JSON(http.StatusOK, translatedText)
}

func outputAPI(c *gin.Context) {

	client := db.GetClient()
	cl, err := db.LoadTextColl(client, "./db/config.yml")

	if err != nil {
		fmt.Println("could not load" + err.Error())
		return
	}

	listOfWords, err := db.FindNWord(cl, 3)
	if err != nil {
		fmt.Println("could not find n words" + err.Error())
		return
	}

	var files []string

	for i := range listOfWords {
		fmt.Println(listOfWords[i].EN)
		TextToSpeech(listOfWords[i].EN, "en")
		TextToSpeech(listOfWords[i].JP, "ja")
		files = append(files, listOfWords[i].EN)
		files = append(files, "silence_5s")
		files = append(files, listOfWords[i].JP)
		files = append(files, "silence_2s")
	}

	urlstring := render(files)
	c.String(200, urlstring)
}

func inputForm(c *gin.Context) {

	japaneseWord := c.PostForm("japaneseWord")
	englishWord := c.PostForm("englishWord")
	userId := c.PostForm("user_id")
	word := db.WordPair{EN: englishWord, JP: japaneseWord, UserID: userId}
	client := db.GetClient()
	cl, err := db.LoadTextColl(client, "./db/config.yml")
	_, err = db.InsertWord(cl, &word)
	if err == nil {
		c.String(200, "inserted data")
	} else {

		c.String(200, "error")
	}
}

func inputTestDb(c *gin.Context) {
	total_ques := c.PostForm("totalQues")
	correct_ans := c.PostForm("correctAns")
	user_id := c.PostForm("userId")

	total_que, _ := strconv.Atoi(total_ques)
	correct_an, _ := strconv.Atoi(correct_ans)

	if total_que < correct_an {
		c.String(200, "test data inconsistent")
		return
	}

	data := db.TestDb{TotalQ: total_que, CorrectA: correct_an, UserID: user_id}
	client := db.GetClient()
	cl, err := db.LoadTestColl(client, "./db/config.yml")
	_, err = db.InsertTest(cl, &data)
	if err == nil {
		c.String(200, "test data inserted")
	} else {
		c.String(200, "error")
	}
}

func getTests(c *gin.Context) {
	user_id := c.Param("user_id")

	client := db.GetClient()
	cl, _ := db.LoadTestColl(client, "./db/config.yml")
	res, e := db.GetTests(cl, user_id)
	if e == nil {
		c.JSON(200, res)
	} else {
		c.String(200, "error")
	}
}

func getWords(c *gin.Context) {
	user_id := c.Param("user_id")

	client := db.GetClient()
	cl, _ := db.LoadTextColl(client, "./db/config.yml")
	res, e := db.GetWords(cl, user_id)
	if e == nil {
		c.JSON(200, res)
	} else {
		c.String(200, "error")
	}

}

func wrongWord(c *gin.Context) {
	var data []db.WrongObj
	if err := c.BindJSON(&data); err != nil {
		c.JSON(400, gin.H{"error": err})
		return
	}

	client := db.GetClient()
	cl, _ := db.LoadTextColl(client, "./db/config.yml")
	e := db.WrongUpdate(cl, data)
	if e == nil {
		c.String(200, "wrong words updated")
	} else {
		c.String(200, "error for wrongWord")
	}

	c.JSON(200, data)
}
func testDB(c *gin.Context) {
	client := db.GetClient()
	cl, err := db.LoadTextColl(client, "./db/config.yml")

	if err != nil {
		fmt.Println("could not load" + err.Error())
		return
	}

	listOfWords, err := db.FindNWord(cl, 100)
	if err != nil {
		fmt.Println("could not find n words" + err.Error())
		return
	}

	c.JSON(200, listOfWords)
}

// Speech struct
type Speech struct {
	Folder   string
	Language string
}

// Speak downloads speech and plays it using mplayer
func (speech *Speech) Speak(text string) error {

	fileName := speech.Folder + "/" + text + ".mp3"

	var err error
	if err = speech.createFolderIfNotExists(speech.Folder); err != nil {
		return err
	}
	if err = speech.downloadIfNotExists(fileName, text); err != nil {
		return err
	}

	return nil
}

/**
 * Create the folder if does not exists.
 */
func (speech *Speech) createFolderIfNotExists(folder string) error {
	dir, err := os.Open(folder)
	if os.IsNotExist(err) {
		return os.MkdirAll(folder, 0700)
	}

	dir.Close()
	return nil
}

/**
 * Download the voice file if does not exists.
 */
func (speech *Speech) downloadIfNotExists(fileName string, text string) error {
	f, err := os.Open(fileName)
	if err != nil {
		url := fmt.Sprintf("http://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&textlen=32&client=tw-ob&q=%s&tl=%s", url.QueryEscape(text), speech.Language)
		response, err := http.Get(url)
		if err != nil {
			return err
		}
		defer response.Body.Close()

		output, err := os.Create(fileName)
		if err != nil {
			return err
		}

		_, err = io.Copy(output, response.Body)
		return err
	}

	f.Close()
	return nil
}

/**
 * Play voice file.
 */
func (speech *Speech) play(fileName string) error {
	mplayer := exec.Command("mplayer", "-cache", "8092", "-", fileName)
	return mplayer.Run()
}

// TextToSpeech is for conveting the input text to speech for respective language
func TextToSpeech(text, lang string) int {
	/*
	  Synthesizes speech from text and saves in an MP3 file.
	  Input -> text(string), language(string)
	  Returns -> None
	*/
	speech := Speech{Folder: "audio", Language: lang}
	speech.Speak(text)
	return 0
}

/*
Performs Speech to Text on an FLAC file
Input : fileDirectory, language of input, sample rate of input
Return: string of words in input file

REQUIRES:
	We need to add the variable to enable the Google Speech to Text api.
	export GOOGLE_APPLICATION_CREDENTIALS=/Users/deddy/Documents/GitHub/jpALP/data/speechToText.json

func SpeechToText(fileDir string, lang string, sampleRate int32) string {
	// creating the context and client
	ctx := context.Background()
	client, err := speech.NewClient(ctx)
	if err != nil {
		fmt.Println(err)
	}

	// Getting the audio file
	audioData, err := ioutil.ReadFile(fileDir)
	if err != nil {
		fmt.Println(err)
	}

	response, err := client.Recognize(ctx, &speechpb.RecognizeRequest{
		Config: &speechpb.RecognitionConfig{
			Encoding:        speechpb.RecognitionConfig_FLAC,
			SampleRateHertz: sampleRate,
			LanguageCode:    lang,
		},
		Audio: &speechpb.RecognitionAudio{
			AudioSource: &speechpb.RecognitionAudio_Content{Content: audioData},
		},
	})

	if err != nil {
		fmt.Println(err)
	}

	var answer []string
	for _, result := range response.Results {
		for _, alt := range result.Alternatives {
			// fmt.Println(alt.Transcript)
			answer = append(answer, alt.Transcript)
		}
	}
	if lang == "ja" {
		return strings.Join(strings.Fields(strings.Join(answer[:], "")), "") // remove all white spaces
	}
	return strings.Join(answer[:], " ") //en has no spaces
}


*/
// Render function to be called with name of the audio files
//(e.g: render("a","silence","b","c","silence","d") where a,b,c,d are file names)

func render(files []string) string {

	mydata := []byte("#mylist.txt\n")

	err := ioutil.WriteFile("temp.txt", mydata, 0777)
	if err != nil {
		fmt.Println(err)
	}

	if _, err := os.Stat("mixed_output.mp3"); err == nil {
		err = os.Remove("mixed_output.mp3")
	}

	fileStr := ""
	result := "/media/mixed_output.mp3"

	for _, fileName := range files {
		fileStr = fileStr + "file 'audio/" + fileName + ".mp3'" + "\n"
	}

	f, err := os.OpenFile("temp.txt", os.O_APPEND|os.O_WRONLY, 0600)
	if err != nil {
		fmt.Println(err)
	}

	if _, err = f.WriteString(fileStr); err != nil {
		fmt.Println(err)
	}

	app := "ffmpeg"
	arg0 := "-f"
	arg1 := "concat"
	arg2 := "-safe"
	arg3 := "0"
	arg4 := "-i"
	arg5 := "temp.txt"
	arg6 := "-c"
	arg7 := "copy"
	arg8 := "static/media/mixed_output.mp3"

	cmd := exec.Command(app, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8)
	stdout, err := cmd.Output()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(stdout)

	cmd = exec.Command("")
	stdout, err = cmd.Output()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(stdout)

	err = os.Remove("temp.txt")
	if err != nil {
		fmt.Println(err)
	}
	return result
}
