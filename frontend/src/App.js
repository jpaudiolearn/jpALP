import React, { Component } from 'react';
import './App.css';
import LoginUI from './components/loginui'
import SpeechRecognition from './components/speechrecog'
import { Route, Router, Switch } from 'react-router-dom';
import { historyMP } from './helper/history';
import { PrivateRoute, LoginRoute } from './helper/private.routes';

class App extends Component {


  render() {
    return (
      <Router history={historyMP}>
        <Switch>
          <LoginRoute path="/login" component={LoginUI} />
          <PrivateRoute path="/homepage" component={SpeechRecognition} />
          <Route exact component={LoginUI} />
        </Switch>
      </Router>
    );
  }
}


export default App;

