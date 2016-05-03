import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Example from './example';

window.onload = () => {
  ReactDOM.render(<Example />, document.getElementById('content'));
};
