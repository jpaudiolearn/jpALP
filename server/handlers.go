package server

import (
	"github.com/gin-gonic/gin"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
)


func hello(c *gin.Context) {
	c.String(200, "Hello World")
}


// Function to Test for errors
func check_err(err error) {
	if err != nil {
		fmt.Println(err)
		//os.Exit(1)
	}
}


// Render function to be called with name of the audio files 
//(e.g: render("a","silence","b","c","silence","d") where a,b,c,d are file names)

func render(files ...string)  string{
   
   mydata := []byte("#mylist.txt\n")

   err := ioutil.WriteFile("temp.txt",mydata,0777)
   check_err(err)

   if _, err := os.Stat("mixed_output.mp3"); err == nil {
   	err = os.Remove("mixed_output.mp3")
   } 

   fileStr := ""
   result := "mixed_output.mp3"

   for _, fileName := range files {
   fileStr = fileStr+"file '"+fileName+".mp3'"+"\n"
   }

   f, err := os.OpenFile("temp.txt",os.O_APPEND|os.O_WRONLY, 0600)
   check_err(err)
   
   if _,err = f.WriteString(fileStr); err!= nil {
   	panic(err)
   }

   app := "ffmpeg"
   arg0 := "-f"
   arg1 := "concat"
   arg2 := "-i"
   arg3 := "temp.txt"
   arg4 := "-c"
   arg5 := "copy"
   arg6 := "mixed_output.mp3"

   cmd := exec.Command(app,arg0,arg1,arg2,arg3,arg4,arg5,arg6)
   stdout, err := cmd.Output()
   check_err(err)
   fmt.Println(stdout)
   err = os.Remove("temp.txt")
   check_err(err)
   return result

}
