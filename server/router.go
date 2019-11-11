package server

import "github.com/gin-gonic/gin"

func setupRoutes(router *gin.Engine) {

	// Mapping html and css files to gin
	router.LoadHTMLGlob("./templates/*.html")
	router.Static("/css", "./static/css")
	router.Static("/js", "./static/js")
	router.Static("/media", "./static/media")

	// It is good practice to version your API from the start
	v1 := router.Group("/api/v1")

	v1.GET("/", hello)
	v1.GET("/output", outputAPI)
	v1.POST("/input", inputForm)
}
