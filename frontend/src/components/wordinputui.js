import React, { Component } from 'react';
import LoginForm from './LoginForm';
import '../startup.css';
import axios from 'axios';
import cookie from 'react-cookies'
import SpeechRecognition from "react-speech-recognition";
import PropTypes from "prop-types";
import Speech from 'react-speech';

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
    };
  }

  processWord = () => {
      console.log("Processing word...")
  }

  changeFSMState = () => {
      
      switch(this.state.currentTranscript) {
          case "add a word":
              if (this.state.inputState == FSMStates.LISTENING) {
                    console.log("Changing state...")
                    this.setState({
                        inputState: FSMStates.WAITING_FOR_WORD,
                    })
                }
                break;
         default: 
                if (this.state.inputState == FSMStates.WAITING_FOR_WORD) {
                    console.log("Changing State..")
                    this.setState({
                        inputState: FSMStates.LISTENING
                    }, () => {this.processWord()})
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
      return (
        <div>
        {this.state.currentTranscript}
        <Speech 
                text="I have the default settings" 
                volume={10}/>
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

