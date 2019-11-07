package server

import "github.com/gin-gonic/gin"

var pokemonList = data.Pokemon().List

func hello(c *gin.Context) {
	c.String(200, "Hello World")
}
