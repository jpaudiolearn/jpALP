import React, { Component } from 'react';
import axios from 'axios';
import revision from '../revision.png'
import { Button } from 'antd'
import { Link } from "react-router-dom";
import Speech from 'speak-tts'

export default class VocabTestResultUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
        wordPairs: [
            {'en': 'Hello', 'jp': 'こんにちは'},
            {'en': 'Sorry', 'jp': 'ごめんなさい'},
        ],
        num_words_revised: 0,
    };
  }

  componentDidMount() {
    // TODO getAllWords
    this.Revise()
  }

  sayWords = (text, lang) => {
    const speech = new Speech()
    speech.setVolume(1)
    speech.setLanguage(lang)
    speech.setRate(1) 
    speech.speak({
        text: text,
    }).then(() => {
        console.log("Success !")
    }).catch(e => {
        console.error("An error occurred :", e)
    })
    
  }

  Revise = () => {
      for(let i=0; i<this.state.wordPairs.length; i++) {
        this.sayWords(this.state.wordPairs[i]['en'], 'en-US')
        this.sayWords(this.state.wordPairs[i]['jp'], 'ja-JP')
        this.state.num_words_revised += 1
      }
      this.sayWords("Revision Done", 'en-US') 
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
                    {/* <h1 style={h1Style}> Number of words revised = {this.state.num_words_revised} </h1> */}
              </div>
              <div style={textStyle}>
                <Link to={'/homepage'}>
                    <Button variant="contained" type="primary">
                        homepage
                    </Button>
                </Link>
              </div>
          </div>
    );
    }
}
