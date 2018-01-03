import React, { Component } from 'react';
import { getSubdomain } from './utils';
import Editor from './Editor';
import LandingPage from './LandingPage';
import { DDTest } from './DragonDrop';
import './css/App.css';

class App extends Component {
  render() {
		return <DDTest />;
    // return <div className="App">{this.renderInner()}</div>
  }
	renderInner() {
		if (getSubdomain() === null) {
			return <LandingPage />;
		} else {
			return <Editor />;
		}
	}
}

// <PanelManager render={(panelMgr) => <TestComponent panelMgr={panelMgr} />} />
// let TestComponent = ({panelMgr}) => {
// 	let push = () => panelMgr.push(new Panel(() => <ModalThing panelMgr={panelMgr}/>, {dimsUI: true}));
// 	return (
// 		<FullyCentered>
// 			<h1>hey there!</h1>
// 			<p>Current subdomain: <strong>{getSubdomain() || 'null'}</strong></p>
// 			<Button onClick={push}>Show a panel!</Button>
// 		</FullyCentered>
// 	)
// }
//
// let ModalThing = ({panelMgr}) => {
// 	let push = (position) => {
// 		panelMgr.push(new Panel(() => {
// 			return <ModalThing panelMgr={panelMgr} />;
// 		}, {position}));
// 	}
// 	return (
// 		<div>
// 			<Button onClick={() => panelMgr.pop()}>Pop something</Button>
// 			<Button onClick={() => push('bottom')}>Push to bottom</Button>
// 			<Button onClick={() => push('top')}>Push to top</Button>
// 		</div>
// 	)
// }

export default App;
