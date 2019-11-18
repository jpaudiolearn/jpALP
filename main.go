package main

import (
	"github.com/gin-gonic/gin"
	"github.com/japaudio/JapALP/server"
)

func main() {
	gin.SetMode(gin.ReleaseMode)

	router := server.CreateRouter()
	// client := db.GetClient()
	// cl, err := db.LoadTextColl(client, "./db/config.yml")
	// if err != nil {
	// 	fmt.Println("could not load" + err.Error())
	// 	return
	// }
	// err = db.InitTextColl(cl)
	// if err != nil {
	// 	fmt.Println("could not load" + err.Error())
	// 	return
	// }
	server.StartServer(router)
}
