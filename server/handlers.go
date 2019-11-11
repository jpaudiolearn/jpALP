package server

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"os/exec"

	"context"
	"io/ioutil"
	"strings"

	"github.com/gin-gonic/gin"

	speech "cloud.google.com/go/speech/apiv1"
	speechpb "google.golang.org/genproto/googleapis/cloud/speech/v1"
)

// var pokemonList = data.Pokemon().List


func hello(c *gin.Context) {
	c.String(200, "Hello World")
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

	return speech.play(fileName)
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

//
func SpeechToText(fileDir string, lang string, sampleRate int32) string {
	/*
		Performs Speech to Text on an FLAC file
		Input : fileDirectory, language of input, sample rate of input
		Return: string of words in input file

		REQUIRES:
			We need to add the variable to enable the Google Speech to Text api.
			export GOOGLE_APPLICATION_CREDENTIALS=/Users/deddy/Documents/GitHub/jpALP/data/speechToText.json
	*/
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
