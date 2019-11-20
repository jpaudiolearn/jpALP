import React, { Component } from 'react';
import LoginForm from './LoginForm';
import '../startup.css';
import axios from 'axios';
import cookie from 'react-cookies'
import SignInSide from './SignInSide'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'


export default class LoginUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayed_form: 'login',
      logged_in: cookie.load('token') ? true : false,
      username: '',
      isCorrect: true
    };
  }

  componentDidMount() {
    if (this.state.logged_in) {
      fetch('/current_user', {
        headers: {
          Authorization: `JWT ${cookie.load('token')}`
        }
      })
        .then(res => res.json())
        .then(json => {
          this.setState({ username: json.username });
        });
    }
  }

  handle_login = (e, data) => {
    e.preventDefault();
    cookie.save('token', "ahjgshajsahjjhadummytoken")
    cookie.save('username', data.username);
    this.props.history.push("/homepage");
    // fetch('http://localhost:8081/token-auth', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data)
    // })
    //   .then(res => res.json()
    //   ).then(json => {
    //     if(json.token === undefined) {
    //       this.setState({
    //         isCorrect: false,
    //       })
    //     }
    //     else {
    //       cookie.save('token', json.token);
    //       cookie.save('username', data.username);
    //       this.setState({
    //         logged_in: true,
    //         displayed_form: '',
    //         username: data.username
    //       });
    //       this.props.history.push("/homepage");
    //     }
    //   })
    //   .catch( err => {
    //     this.setState({
    //     isCorrect: false,
    //     });
    //     console.log("Login Failed", err);
        
    //   })
  };

  // handle_logout = () => {
  //   cookie.remove('token');
  //   this.setState({ logged_in: false, username: '' }, () => this.props.history.push('/login'));
  // };

  // display_form = form => {
  //   this.setState({
  //     displayed_form: form
  //   });
  // };

  render() {
    let form = <LoginForm handle_login={this.handle_login} 
                          isCorrect={this.state.isCorrect}/>;

    return (
          <div className="startup">
            {form}
          </div>
    );
    }
}
