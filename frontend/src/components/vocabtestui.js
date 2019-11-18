import React, { Component } from 'react';
import axios from 'axios';
import revision from '../revision.png'
import { Button } from 'antd'
import { Link } from "react-router-dom";
import Speech from 'speak-tts'
import ReactCountdownClock from "react-countdown-clock"

export default class VocabTestUI extends Component {
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
    window.onbeforeunload = () => {
        return "Dude, are you sure you want to leave? Think of the kittens!";
    }
    this.startTest()
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

  startTest = () => {

  }

  timeCompleteCallBack = () => {
      this.props.history.push('/vocabtestresult')
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
