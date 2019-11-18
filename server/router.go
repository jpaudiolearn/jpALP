package server

import (
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
)

func setupRoutes(router *gin.Engine) {
	router.POST("/token-auth", authMiddleware.LoginHandler)
	router.GET("/refresh-token", authMiddleware.RefreshHandler)

	// Mapping html and css files to gin
	//fmt.Println(gin.Mode())
	if mode := gin.Mode(); mode == gin.DebugMode {
		router.LoadHTMLGlob("../templates/*")
	} else {
		router.LoadHTMLGlob("./templates/*")
	}
	router.Static("/css", "./static/css")
	router.Static("/js", "./static/js")
	router.Static("/media", "./static/media")
	router.Static("/audio", "./audio")

	// It is good practice to version your API from the start
	v1 := router.Group("/api/v1")

	v1.GET("/", homePage)
	v1.POST("/output", outputAPI)
	v1.POST("/input", inputForm)
	v1.GET("/translate/:text", translateTextHandler)
}
