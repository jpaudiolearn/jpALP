import React, { Component } from 'react';
import './App.css';
import LoginUI from './components/loginui'
import HomePageUI from './components/homepageui'
import WordInputUI from './components/wordinputui'
import VocabTestStartUI from './components/vocabteststartui'
import VocabTestUI from './components/vocabtestui'
import VocabTestResultUI from './components/vocabtestresultui'
import RevisionUI from './components/revisionui'
import { Route, Router, Switch } from 'react-router-dom';
import { historyMP } from './helper/history';
import { PrivateRoute, LoginRoute } from './helper/private.routes';

class App extends Component {


  render() {
    return (
      <Router history={historyMP}>
        <Switch>
          <LoginRoute path="/login" component={LoginUI} />
          <PrivateRoute path="/homepage" component={HomePageUI} />
          <PrivateRoute path="/wordinput" component={WordInputUI} />
          <PrivateRoute path="/vocabteststart" component={VocabTestStartUI} />
          <PrivateRoute path="/vocabtest" component={VocabTestUI} />
          <PrivateRoute path="/vocabtestresult" component={VocabTestResultUI} />
          <PrivateRoute path="/revision" component={RevisionUI} />
          <Route exact component={LoginUI} />
        </Switch>
      </Router>
    );
  }
}


export default App;

