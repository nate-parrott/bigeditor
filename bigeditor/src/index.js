import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { initFirebase } from './FirebaseIntegration';

initFirebase();

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
