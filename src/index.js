import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from "./store";
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Provider store={configureStore()}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
    document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}

registerServiceWorker();
