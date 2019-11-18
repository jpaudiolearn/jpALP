import React, { Component } from 'react';
import axios from 'axios';
import revision from '../revision.png'
import { Button } from 'antd'
import { Link } from "react-router-dom";
import Speech from 'speak-tts'

export default class RevisionUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
        wordPairs: [
            {'en': 'Hello', 'jp': 'こんにちは'},
            {'en': 'Sorry', 'jp': 'ごめんなさい'},
        ],
        numWordsRevised: 0,
        currWordIndex: 0,
    };
    this.speech = new Speech()
    this.timers = []
  }

  componentDidMount() {
    // TODO getAllWords
    this.reviseOneWord()
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

  reviseOneWord = () => {
      this.sayWords(this.state.wordPairs[this.state.currWordIndex]['en'], 'en-US')
      let thisPointer = this
      this.timers.push(setTimeout(() => {
        thisPointer.sayWords(this.state.wordPairs[this.state.currWordIndex]['jp'], 'ja-JP')
        this.setState({
          currWordIndex: (this.state.currWordIndex+1)%this.state.wordPairs.length,
          numWordsRevised: this.state.numWordsRevised+1
        })
        thisPointer.reviseOneWord()
      }, 4000))
  }

  returnHome = () => {
    this.speech.cancel()
    for(let i=0; i<this.timers.length; i++) {
      clearTimeout(this.timers[i])
    }
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

    const h1Style =  {
        position: "absolute",
        left: "610px",
        top: "600px",
        fontSize: "62px"
      }
    return (
          <div>
              <div style={imageStyle}>
                    <img src={revision}/>
              </div>
              <div>
                    <h1 style={h1Style}> Number of words revised = {this.state.numWordsRevised} </h1>
              </div>
              <div style={textStyle}>
                <Link to={'/homepage'}>
                    <Button variant="contained" type="primary" onClick={this.returnHome}>
                        homepage
                    </Button>
                </Link>
              </div>
          </div>
    );
    }
}
