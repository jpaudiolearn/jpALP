import React, { Component } from 'react';
import LoginForm from './LoginForm';
import '../startup.css';
import axios from 'axios';
import SpeechRecognition from "react-speech-recognition";
import PropTypes from "prop-types";
import Speech from 'speak-tts'
import { Button, Spin} from 'antd'
import 'antd/dist/antd.css'
import { Link } from "react-router-dom";
import mtfuji from '../mtfuji.jpg'; 
import cookie from 'react-cookies';


axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const FSMStates = {
    LISTENING: 'listening',
    WAITING_FOR_WORD: 'waiting_for_word',
}


class WordInputUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
        currentTranscript: "",
        inputState: FSMStates.LISTENING,
        displayText: "Say, \"Add\"",
        isLoading: false,
    };
    this.controller = new AbortController()
  }

  sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  sayWord = (text, lang) => {
    const speech = new Speech()
    speech.setVolume(1)
    speech.setLanguage(lang)
    speech.speak({
        text: text,
    }).then(() => {
        console.log("Success !")
    }).catch(e => {
        console.error("An error occurred :", e)
    })
  }

  postWordPair = (enWord, jpWord) => {
    let url = `http://35.221.94.98:8080/api/v1/input`;
    let wordPairData = {
        'EN': enWord,
        'JP': jpWord,
        'UserID': cookie.load('username') 
    }
    axios.post(url, wordPairData, { headers: {'Content-Type': "application/json"}, signal: this.controller.signal})
    .then(response => {
            console.log(response)
    })
  }

  processWord = (word) => {
      this.sayWord("Saving..", 'en-US')
      this.sayWord(word, 'en-US')
      this.sayWord("which in japanese is", 'en-US')
      
      // Now get the japanese translation
      let url = `http://35.221.94.98:8080/api/v1/translate/${word}`;
      let jpWord = ""
      axios.get(url, { headers: {'Content-Type': "application/json"}, signal: this.controller.signal})
          .then(response => {
                jpWord = response.data
                this.sayWord(response.data, 'ja-JP')
                this.setState({
                    isLoading: false,
                    displayText: "Say, \"Add\"",
                }, () => {this.postWordPair(word, jpWord)})
                // url = `http://35.190.224.222:8080/api/v1/input`;
                // let wordPairData = {
                //     'EN': word,
                //     'JP': jpWord,
                //     'UserID': cookie.load('username') 
                // }
                // axios.post(url, wordPairData, { headers: {'Content-Type': "application/json"}})
                // .then(response => {
                //         console.log(response)
                //         this.setState({
                //             isLoading: false,
                //             displayText: "Say, \"Add\""
                //         })
                // })
          })
      
      
  }

  changeFSMState = () => {
      
      switch(this.state.currentTranscript) {
          case "add":
              if (this.state.inputState == FSMStates.LISTENING) {
                    console.log("Changing state...")
                    this.setState({
                        inputState: FSMStates.WAITING_FOR_WORD,
                        displayText: "Please say your English word"
                    })
                }
                break;
         default: 
                if (this.state.inputState == FSMStates.WAITING_FOR_WORD) {
                    console.log("Changing State..")
                    this.setState({
                        inputState: FSMStates.LISTENING,
                        isLoading: true,
                    }, () => {this.processWord(this.state.currentTranscript)})
                }
            
      }
  }

    getNewWord = (s1, s2) => {
        let l1 = s1.length
        let l2 = s2.length
        return s2.substring(l1)
    }
    componentWillReceiveProps(nextProps) {
       if (nextProps.finalTranscript != this.props.finalTranscript) {
           let newWord = this.getNewWord(this.props.finalTranscript, nextProps.finalTranscript)
            if (this != null) {
                this.setState({
                    currentTranscript: newWord.trim().toLowerCase(),
                },() => {this.changeFSMState();})
            }
       }
    }
  componentDidMount() {
        this.props.startListening()
  }

  componentWillUnmount() {
      this.controller.abort()
  }

  render() {
      const imageStyle = {
        maxHeight: "100%",
        maxWidth: "100%",
      }

      const h1Style =  {
        fontSize: "62px"
      }
    const textStyle = {
        position: "absolute",
        left: "40%",
        top: "20%",

    } 
    const homeStyle = {
        position: "absolute",
        left: "45%",
        top: "65%",

    } 
      return (
        <div>
            <Spin tip="Saving word..." spinning={this.state.isLoading} delay={500}>
                <img src={mtfuji} style={imageStyle}/>
                <div style={textStyle}>
                    <h1 style={h1Style}>{this.state.displayText}</h1>
                    </div>
                    <div style={homeStyle}>
                    <Link to={'/homepage'}>
                        <Button variant="contained" type="primary">
                            homepage
                        </Button>
                    </Link>
                </div>
            </Spin>
        </div>

      )
  }
}

WordInputUI.propTypes = {
    // Props injected by SpeechRecognition
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

export default SpeechRecognition(options)(WordInputUI);

