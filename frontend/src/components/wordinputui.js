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
        displayText: "Say, \"Add a word\"",
        isLoading: false,
    };
  }

  sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  sayWord = (word, lang) => {
    const speech = new Speech()
    speech.setVolume(1)
    speech.setLanguage(lang)
    speech.setRate(1) 
    speech.speak({
        text: word,
    }).then(() => {
        console.log("Success !")
    }).catch(e => {
        console.error("An error occurred :", e)
    })
  }

  processWord = (word) => {
      this.sayWord("Saving..", 'en-US')
      this.sayWord(word, 'en-US')
      this.sayWord("which in japanese is", 'en-US')
      // TODO: Get the translation
      this.sayWord("こんにちは", 'ja-JP')
      // TODO: add to database
      this.setState({
          isLoading: false,
          displayText: "Say, \"Add a word\""
      })
  }

  changeFSMState = () => {
      
      switch(this.state.currentTranscript) {
          case "add a word":
              if (this.state.inputState == FSMStates.LISTENING) {
                    console.log("Changing state...")
                    this.setState({
                        inputState: FSMStates.WAITING_FOR_WORD,
                        displayText: "Please say the English word you want to add"
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
                else {
                    console.log(this.state)
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

            this.setState({
                currentTranscript: newWord.trim().toLowerCase(),
            },() => {this.changeFSMState();})
       }
    }
  componentDidMount() {
        this.props.startListening()
  }

  render() {
    //   const inputStyle = {
    //     backgroundImage: 'url(https://source.unsplash.com/random)',
    //     backgroundPosition: 'center',
    //     backgroundSize: 'cover',
    //     backgroundRepeat: 'no-repeat'
    //   }
    const inputStyle = {
        position: "absolute",
        left: "710px",
        top: "400px",
    } 
      return (
        <div style={inputStyle}>
            <Spin tip="Saving word..." spinning={this.state.isLoading} delay={500}>
                <h1>{this.state.displayText}</h1>
                <br/><br/><br/>
                <Link to={'/homepage'}>
                    <Button variant="contained" type="primary">
                        homepage
                    </Button>
                </Link>
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
    //   continuous: false,
  }

export default SpeechRecognition(options)(WordInputUI);

