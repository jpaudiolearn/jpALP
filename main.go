package main

import (
	"github.com/japaudio/JapALP/server"
)

func main() {
	router := server.CreateRouter()
	server.StartServer(router)
}
