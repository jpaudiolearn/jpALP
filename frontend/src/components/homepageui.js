import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies'
import { Button } from 'antd'
import 'antd/dist/antd.css'
import { Link } from "react-router-dom";




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
    return (
          <div style={hStyle}>
                <Link to={'/wordinput'}>
                    <Button variant="contained" type="primary">
                        Add a new word
                    </Button>
                </Link>
                <br/> <br/>
                <Link to={'/vocabteststart'}>
                    <Button variant="contained" type="primary">
                        Test your vocab
                    </Button>
                </Link>
                <br/> <br/>
                <Link to={'/revision'}>
                    <Button variant="contained" type="primary">
                        Revise words
                    </Button>
                </Link>
                <br/><br/>
                <Button onClick={this.logoutClick} variant="contained" type="danger">
                    Logout
                </Button>
                
          </div>
    );
    }
}
