import React, { Component } from 'react';
import axios from 'axios';
import vocabtest from '../vocabtest.jpg'
import { Button, Card, Select} from 'antd'
import { Link } from "react-router-dom";

const { Option } = Select

export default class VocabTestStartUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testTime: 1,
    };
  }

  componentDidMount() {
    
  }

  handleChange = (value) => {
    console.log(value)
    this.setState({
      testTime: value,
    })
  } 


  render() {
    const imageStyle = {
      position: "absolute",
      left: "30%",
    }

    const cardStyle = {
      position: "absolute",
      left: "30%",
      top: "37%",
      width: 600,
    }

    const homeStyle = {
      position: "absolute",
      left: "52%",
      top: "90%",
    } 

    const timeStyle = {
      position: "absolute",
      left: "47%",
      top: "82%",
    } 
    const startStyle = {
      position: "absolute",
      left: "42%",
      top: "90%",
    } 
    return (
          <div>
              <div style={imageStyle}>
                    <img src={vocabtest} height={300}/>
              </div>
              <div style={cardStyle}>
                  <Card title="Instructions" hoverable>
                      <p>1. Make sure you are taking this test in a quiet environment</p>
                      <p>2. You will first hear a English word</p>
                      <p>3. Say the corresponding Japanese word after you are asked to do so</p>
                      <p>4. Try to answer maximum translations in the given time</p>
                      <p>5. If you don't answer within 5 secs, you will be marked as wrong</p>
                      <p>6. Select the duration of the test and then start the test</p>
                  </Card>
              </div>
              <div style={timeStyle}>
                <Select defaultValue={1} style={{ width: 120 }} onChange={this.handleChange}>
                  <Option value={0.25}>15 sec</Option>
                  <Option value={1}>1 min</Option>
                  <Option value={2}>2 min</Option>
                  <Option value={5}>5 min</Option>
                </Select>
              </div>

              <div style={startStyle}>
                <Link to={{
                  pathname: '/vocabtest',
                  state: {testTime: this.state.testTime * 60}
                }}>
                    <Button variant="contained" type="primary">
                        Start Test
                    </Button>
                </Link>
              </div>
              <div style={homeStyle}>
                <Link to={'/homepage'}>
                    <Button variant="contained" type="danger">
                        homepage
                    </Button>
                </Link>
              </div>
          </div>
    );
    }
}
