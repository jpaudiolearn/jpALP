package server

import (
	"context"
	"log"

	"cloud.google.com/go/translate"
	"golang.org/x/text/language"
)

func translateText(targetLanguage, text string) (string, error) {
	ctx := context.Background()

	lang, err := language.Parse(targetLanguage)
	if err != nil {
		log.Fatalf("Failed to parse target language: %v", err)
		return "", err
	}

	client, err := translate.NewClient(ctx)
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
		return "", err
	}
	defer client.Close()

	resp, err := client.Translate(ctx, []string{text}, lang, nil)
	if err != nil {
		log.Fatalf("Failed to translate text: %v", err)
		return "", err
	}
	return resp[0].Text, nil
}

func detectLanguage(text string) (*translate.Detection, error) {
	ctx := context.Background()
	client, err := translate.NewClient(ctx)
	if err != nil {
		return nil, err
	}
	defer client.Close()

	lang, err := client.DetectLanguage(ctx, []string{text})
	if err != nil {
		return nil, err
	}
	return &lang[0][0], nil
}
