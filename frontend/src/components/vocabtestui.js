import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'antd'
import { Link } from "react-router-dom";
import Speech from 'speak-tts'
import ReactCountdownClock from "react-countdown-clock"
import SpeechRecognition from "react-speech-recognition";
import PropTypes from "prop-types";
import cookie from 'react-cookies';

class VocabTestUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
        wordPairs: [
            {'en': 'Hello', 'jp': 'こんにちは'},
            {'en': 'Sorry', 'jp': 'ごめんなさい'},
        ],
        totalQues: 0,
        correctAns: 0,
        currWordIndex: 0,
        currJPWord: "",
        currentTranscript: "",
    };
    this.speech = new Speech()
    this.timer = null
  }

  getAllWords = () => {
    let url = `http://35.190.224.222:8080/api/v1/words/${cookie.load('username')}`;
    let wordPairsArr = []
    axios.get(url, { headers: {'Content-Type': "application/json"}})
          .then(response => {
                return response.data
          }).then(wordPairsData => {
                wordPairsData.map((value, index) => {
                    let wordPair = {
                      'en': value.EN,
                      'jp': value.JP,
                    }
                    wordPairsArr.push(wordPair)
                })
                this.setState({
                  wordPairs: wordPairsArr
                }, () => {this.askQuestion()})
          })
  }

  componentDidMount() {
    window.onbeforeunload = () => {
        return "Dude, are you sure you want to leave? Think of the kittens!";
    }
    this.props.recognition.lang = 'ja-JP'
    this.props.startListening()
    // this.askQuestion()
    this.getAllWords()
  }

  getNewWord = (s1, s2) => {
    let l1 = s1.length
    let l2 = s2.length
    return s2.substring(l1)
}

  componentWillReceiveProps(nextProps) {
      if (nextProps.finalTranscript != this.props.finalTranscript) {
          let newWord = this.getNewWord(this.props.finalTranscript, nextProps.finalTranscript)
          console.log(newWord)
          this.setState({
              currentTranscript: newWord.trim().toLowerCase(),
          },() => {this.checkAns()})
      }
  }

  sayWords = (text, lang) => {
    this.speech.setVolume(1)
    this.speech.setLanguage(lang)
    this.speech.setRate(1) 
    this.speech.speak({
        text: text,
    }).then(() => {
        console.log("Success !")
    }).catch(e => {
        console.error("An error occurred :", e)
    })
    
  }

  checkAns = () => {
      if (this.state.currentTranscript == this.state.currJPWord) {
          this.sayWords("You are correct! Next question now..", 'en-US')
          this.setState({
            totalQues: this.state.totalQues + 1,
            correctAns: this.state.correctAns + 1,
            currWordIndex: (this.state.currWordIndex + 1) % this.state.wordPairs.length
          })
          clearTimeout(this.timer)

          // Wait till the speaking finishes and then ask the question
          let thisPointer = this
            setTimeout(() => {
                thisPointer.askQuestion()
            }, 3000);
      } else {
        this.sayWords("Sorry, your answer is incorrect. Next question now..", 'en-US')
        this.setState({
          totalQues: this.state.totalQues + 1,
          currWordIndex: (this.state.currWordIndex + 1) % this.state.wordPairs.length
        })
        clearTimeout(this.timer)
        let thisPointer = this
        // Wait till the speaking finishes and then ask the question

        setTimeout(() => {
            thisPointer.askQuestion()
        }, 3000);
      }
  }

  checkAnsTimeout = () => {
    this.sayWords("Sorry, time's up. Next question now..", 'en-US')

    this.setState({
        totalQues: this.state.totalQues + 1,
        currWordIndex: (this.state.currWordIndex + 1) % this.state.wordPairs.length,
    })

    // Wait till the speaking finishes and then ask the question
    let thisPointer = this
    setTimeout(() => {
        thisPointer.askQuestion()
    }, 3000);
  }

  askQuestion = () => {
        this.sayWords("Your English word is...", "en-US")
        this.sayWords(this.state.wordPairs[this.state.currWordIndex]['en'], "en-US")
        this.sayWords("Say your Japanese word now..", "en-US")
        this.setState({
            currJPWord: this.state.wordPairs[this.state.currWordIndex]['jp'],
        })
        let thisPointer = this
        this.timer = setTimeout(() => {
            thisPointer.checkAnsTimeout()
        }, 10000);
}
  

  timeCompleteCallBack = () => {
    clearTimeout(this.timer)
    this.speech.cancel()
    let url = `http://35.190.224.222:8080/api/v1/testInput`;
    let wordPairData = {
        'TotalQ': this.state.totalQues,
        'CorrectA': this.state.correctAns,
        'UserID': cookie.load('username') 
    }
    axios.post(url, wordPairData, { headers: {'Content-Type': "application/json"}})
    .then(response => {
            console.log(response)
    })
    this.props.history.push({
      pathname: '/vocabtestresult',
      state: {correctAns: this.state.correctAns, totalQues: this.state.totalQues}
    })
  }


  render() {
    const textStyle = {
        position: "absolute",
        left: "48%",
        top: "80%",

    } 

    const timerStyle =  {
        position: "absolute",
        left: "40%",
        top: "10%",
        fontSize: "62px"
      }
    return (
          <div>
            <div style={timerStyle}>
                <ReactCountdownClock seconds={this.props.location.state.testTime}
                                color="#0000A0"
                                alpha={0.9}
                                size={300}
                                onComplete={this.timeCompleteCallBack} />
            </div>
              <div style={textStyle}>
                <Button variant="contained" type="danger" onClick={this.timeCompleteCallBack}>
                    End Test
                </Button>
              </div>
          </div>
    );
    }
}

VocabTestUI.propTypes = {
    transcript: PropTypes.string,
    resetTranscript: PropTypes.func,
    startListening: PropTypes.func,
    stopListening: PropTypes.func,
    browserSupportsSpeechRecognition: PropTypes.bool,
    recognition: PropTypes.object,
    finalTranscript: PropTypes.string,
  };

  const options = {
      autoStart: false,
  }

export default SpeechRecognition(options)(VocabTestUI);
