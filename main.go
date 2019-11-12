package main

import (
	"fmt"

	"github.com/japaudio/JapALP/db"
	"github.com/japaudio/JapALP/server"
)

func main() {
	router := server.CreateRouter()
	client := db.GetClient()
	cl, err := db.LoadTextColl(client, "./db/config.yml")
	if err != nil {
		fmt.Println("could not load" + err.Error())
		return
	}
	err = db.InitTextColl(cl)
	if err != nil {
		fmt.Println("could not load" + err.Error())
		return
	}
	server.StartServer(router)
}
