import React from "react"
import * as reactHelmetAsync from 'react-helmet-async';
import { Provider } from "react-redux"
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from "./redux/Store.js"


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <reactHelmetAsync.HelmetProvider>

      <Provider store={store}>
        <App />
      </Provider>

    </reactHelmetAsync.HelmetProvider>
  </React.StrictMode>
);


