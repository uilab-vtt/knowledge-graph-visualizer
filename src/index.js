import React from 'react';
import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css';
import 'font-awesome/css/font-awesome.css';
import 'video-react/dist/video-react.css';
import 'rc-slider/assets/index.css';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
