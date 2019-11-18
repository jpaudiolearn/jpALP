import React, { Component } from 'react';
import axios from 'axios';
import { Button } from 'antd'
import { Link } from "react-router-dom";
import Speech from 'speak-tts'
import ReactCountdownClock from "react-countdown-clock"
import SpeechRecognition from "react-speech-recognition";
import PropTypes from "prop-types";

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

  componentDidMount() {
    // TODO getAllWordPairs
    window.onbeforeunload = () => {
        return "Dude, are you sure you want to leave? Think of the kittens!";
    }
    this.props.recognition.lang = 'ja-JP'
    this.props.startListening()
    this.askQuestion()
  }

  getNewWord = (s1, s2) => {
    let l1 = s1.length
    let l2 = s2.length
    return s2.substring(l1)
}

  componentWillReceiveProps(nextProps) {
    if (nextProps.finalTranscript != this.props.finalTranscript) {
        let newWord = this.getNewWord(this.props.finalTranscript, nextProps.finalTranscript)

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
      this.props.history.push('/vocabtestresult')
      this.speech.cancel()
  }


  render() {
    const imageStyle = {
        position: "absolute",
        left: "710px",
        top: "100px",
        maxHeight: "100%",
        maxWidth: "100%",
      }

    const textStyle = {
        position: "absolute",
        left: "910px",
        top: "800px",

    } 

    const timerStyle =  {
        position: "absolute",
        left: "810px",
        top: "100px",
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
              
              <div>
                    {/* <h1 style={h1Style}> Number of words revised = {this.state.num_words_revised} </h1> */}
              </div>
              <div style={textStyle}>
                <Link to={{
                    pathname: 'vocabtestresult',
                    state: {},
                }}>
                    <Button variant="contained" type="danger">
                        End Test
                    </Button>
                </Link>
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
