package server

import (
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"os/exec"

	"github.com/japaudio/JapALP/db"

	"github.com/gin-gonic/gin"
)

func homePage(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", gin.H{})
}

func outputAPI(c *gin.Context) {

	//c.String(200, "/media/sample.mp3")
	//client := db.GetClient()
	//cl, err := db.LoadTextColl(client, "./db/config.yml")

	word1 := db.WordPair{EN: "water", JP: "みず"}
	//_, err = db.InsertWord(cl, &word)
	word2 := db.WordPair{EN: "ear", JP: "みみ"}
	//_, err = db.InsertWord(cl, &word)
	word3 := db.WordPair{EN: "car", JP: "くるま"}
	//_, err = db.InsertWord(cl, &word)
	TextToSpeech(word1.EN, "en")
	TextToSpeech(word1.JP, "ja")
	TextToSpeech(word2.EN, "en")
	TextToSpeech(word2.JP, "ja")
	TextToSpeech(word3.EN, "en")
	TextToSpeech(word3.JP, "ja")

	url := render(word1.EN, word1.JP, word2.EN, word2.JP, word3.EN, word3.JP)
	c.String(200, url)
}

func inputForm(c *gin.Context) {

	japaneseWord := c.PostForm("japaneseWord")
	englishWord := c.PostForm("englishWord")
	word := db.WordPair{EN: englishWord, JP: japaneseWord}
	client := db.GetClient()
	cl, err := db.LoadTextColl(client, "./db/config.yml")
	_, err = db.InsertWord(cl, &word)
	fmt.Println()
	if err == nil {
		fmt.Println("insert")
		c.String(200, "inserted data")
	} else {

		c.String(200, "error")
	}
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
	//return speech.play(fileName)
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

func render(files ...string) string {

	mydata := []byte("#mylist.txt\n")

	err := ioutil.WriteFile("temp.txt", mydata, 0777)
	if err != nil {
		fmt.Println(err)
	}

	if _, err := os.Stat("mixed_output.mp3"); err == nil {
		err = os.Remove("mixed_output.mp3")
	}

	fileStr := ""
	result := "mixed_output.mp3"

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
	arg2 := "-safe 0 -i"
	arg3 := "temp.txt"
	arg4 := "-c"
	arg5 := "copy"
	arg6 := "mixed_output.mp3"

	cmd := exec.Command(app, arg0, arg1, arg2, arg3, arg4, arg5, arg6)
	stdout, err := cmd.Output()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(stdout)

	// err = os.Remove("temp.txt")
	// if err != nil {
	// 	fmt.Println(err)
	// }
	return result
}
