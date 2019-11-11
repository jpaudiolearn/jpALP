package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func hello(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", gin.H{})
}

func outputAPI(c *gin.Context) {
	c.HTML(http.StatusOK, "output.html", gin.H{"title": "Take a Test"})
}

func inputForm(c *gin.Context) {
	//c.HTML(http.StatusOK, "inputForm.html", gin.H{"title": "Take a Test"})
	japaneseWord := c.PostForm("japaneseWord")
	englishWord := c.PostForm("englishWord")
	c.String(200, japaneseWord+"###"+englishWord)
}
