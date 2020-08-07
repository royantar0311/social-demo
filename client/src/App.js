import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Join from './components/Join/Join';
import Chat from './components/Chat/Chat';
import './app.css';
function app() {
  return (
    <Router>
      <div className='App'>
        <Route path='/' exact component={Join}></Route>
        <Route path='/chat' exact component={Chat}></Route>
      </div>
    </Router>
  );
}

export default app;
