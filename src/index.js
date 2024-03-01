import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import App from './App/App.js';
import store from "./App/store.js"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App state={store.getState()}/> 
    </Provider>
  </React.StrictMode>
);


