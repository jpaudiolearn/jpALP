package server_test

import (
	"net/http"
	"net/http/httptest"

	"github.com/gin-gonic/gin"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"

	. "github.com/japaudio/JapALP/server"
)

func performRequest(r http.Handler, method, path string) *httptest.ResponseRecorder {
	req, _ := http.NewRequest(method, path, nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

var _ = Describe("Server", func() {
	var (
		router   *gin.Engine
		response *httptest.ResponseRecorder
	)

	BeforeEach(func() {
		router = CreateRouter()
		// Since we modify lists in memory, we need to restore them to a clean state before every test
		// data.Reload()
	})

	Describe("Version 1 API at /api/v1", func() {
		Describe("The / endpoint", func() {
			BeforeEach(func() {
				response = performRequest(router, "GET", "/api/v1/")
			})

			It("Returns with Status 200", func() {
				Expect(response.Code).To(Equal(200))
			})
		})

		Describe("The text to speech", func() {
			It("Returns 0", func() {
				Expect(TextToSpeech("Hello world", "en")).To(Equal(0))
			})
		})

		Describe("The text to speech", func() {
			It("Returns 0", func() {
				Expect(TextToSpeech("人生の目的は何ですか", "ja")).To(Equal(0))
			})
		})

		/*
			Describe("Speech to Text - English", func() {
				It("Reads Hello World", func() {
					Expect(SpeechToText(
						"audio/HelloWorld.flac",
						"en",
						8000,
					)).To(Equal("hello world"))
				})
			})

			Describe("Speech to Text - Japanese", func() {
				It("Reads 人生の目的は何ですか", func() {
					Expect(SpeechToText(
						"audio/人生の目的は何ですか.flac",
						"ja",
						8000,
					)).To(Equal("人生の目的は何ですか"))
				})
			})
		*/

	})
})
