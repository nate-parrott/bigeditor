import React, { Component } from 'react';
import { getSubdomain } from './utils';
import Editor from './Editor';
import LandingPage from './LandingPage';
import './css/App.css';

class App extends Component {
  render() {
    return <div className="App">{this.renderInner()}</div>
  }
	renderInner() {
		if (getSubdomain() === null) {
			return <LandingPage />;
		} else {
			return <Editor />;
		}
	}
}

export default App;
