import ReactDOM from 'react-dom';
import React from 'react';
import MainView from '../view/MainView';

const rootEl = document.getElementById("react-password")

rootEl && ReactDOM.render(<MainView />, rootEl)