import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies'
import { Button, Card} from 'antd'
import 'antd/dist/antd.css'
import { Link } from "react-router-dom";

const { Meta } = Card;

export default class HomePageUI extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    
  }

  logoutClick = () => {
        cookie.remove('token');
        this.props.history.push("/login");
    }

  render() {
    const hStyle = {
        position: "absolute",
        left: "610px",
        top: "20px",
    } 
    const inputStyle = {
        position: "absolute",
        left: "510px",
        top: "220px",
    } 
    const testStyle = {
        position: "absolute",
        left: "850px",
        top: "220px",
    }
    const revisionStyle = {
        position: "absolute",
        left: "1150px",
        top: "220px",
    } 
    return (
          <div>
                <div style={inputStyle}>
                    <Link to={'/wordinput'}>
                        <Card
                            hoverable
                            style={{ width: 200}}
                            cover={<img alt="example" src="https://bradworthley.com/wp-content/uploads/2018/05/4-ADD-Book-Front-Cover-Small.jpg" />}
                        >
                            <Meta title="Add a word" description="Add a new En-Jp pair"/>
                        </Card>
                    </Link>
                </div>
                <div style={testStyle}>
                    <Link to={'/vocabteststart'}>
                        <Card
                            hoverable
                            style={{ width: 190}}
                            cover={<img alt="example" src="https://images-na.ssl-images-amazon.com/images/I/51yWwv5125L.jpg" />}
                        >
                            <Meta title="Test vocab" description="A test to judge your skills"/>
                        </Card>
                    </Link>
                </div>
                <div style={revisionStyle}>
                    <Link to={'/revision'}>
                        <Card
                            hoverable
                            style={{ width: 250}}
                            cover={<img alt="example" src="https://www.rainbowromancewriters.com/sites/rainbowromancewriters.com/files/keep-calm-and-start-revising-16.png" />}
                        >
                            <Meta title="Revision" description="Revise En-Jp pairs"/>
                        </Card>
                    </Link>
                </div>
                <br/><br/>
                <Button onClick={this.logoutClick} variant="contained" type="danger">
                    Logout
                </Button>
                
          </div>
    );
    }
}
