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
    };
  }

  componentDidMount() {
    // TODO getAllWords
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
        left: "710px",
        top: "400px",
        fontSize: "62px"
      }
    return (
          <div>
              <div >
                 <h1 style={h1Style}> Your score is {this.props.location.state.correctAns}/{this.props.location.state.totalQues} </h1>
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
