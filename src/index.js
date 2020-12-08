import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider } from 'react-redux'
import Store from './redux/store'
import {BrowserRouter as Router } from 'react-router-dom'

ReactDOM.render(
  <React.StrictMode>
    <Router>
    <Provider store={Store}>
      <App />
    </Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

