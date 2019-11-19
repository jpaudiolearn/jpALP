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
    const textStyle = {
        position: "absolute",
        left: "47%",
        top: "60%",

    } 

    const h1Style =  {
        position: "absolute",
        left: "35%",
        top: "30%",
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
