import React, { Component } from 'react';
import { Button, FullyCentered } from './UI';
import { PanelManager, Panel } from './Panels';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
				<PanelManager render={(panelMgr) => <TestComponent panelMgr={panelMgr} />} />
			</div>
    );
  }
}

let TestComponent = ({panelMgr}) => {
	let push = () => panelMgr.push(new Panel(() => <ModalThing panelMgr={panelMgr}/>, {dimsUI: true}));
	return (
		<FullyCentered>
			<h1>hey there!</h1>
			<Button onClick={push}>Show a panel!</Button>
		</FullyCentered>
	)
}

let ModalThing = ({panelMgr}) => {
	let push = (position) => {
		panelMgr.push(new Panel(() => {
			return <ModalThing panelMgr={panelMgr} />;
		}, {position}));
	}
	return (
		<div>
			<Button onClick={() => panelMgr.pop()}>Pop something</Button>
			<Button onClick={() => push('bottom')}>Push to bottom</Button>
			<Button onClick={() => push('top')}>Push to top</Button>
		</div>
	)
}

export default App;
