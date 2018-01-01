import React, { Component } from 'react';
import './Panels.css';

export class Panel {
	constructor(renderFunc, options) {
		this.renderFunc = renderFunc;
		this.dimsUI = options.dimsUI === undefined ? true : options.dimsUI;
		this.dismissOnTap = options.dismissViaTap === undefined ? true : null;
		this.position = options.position || 'bottom';
	}
}

export class PanelManager extends Component {
	constructor(props) {
		super(props);
		this.state = {panels: []};
	}
	render() {
		return (
			<div className='PanelManager'>
				<div className='children'>{this.props.render(this)}</div>
				<PanelStack panels={this.state.panels} onPop={this.pop.bind(this)} />
			</div>
		)
	}
	push(panel) {
		this.setState({panels: [...this.state.panels, panel]});
	}
	pop() {
		let panels = [...this.state.panels];
		if (panels.length) panels.splice(panels.length-1, 1);
		this.setState({panels});
	}
}

let PanelStack = ({panels, onPop}) => {
	if (panels.length === 0) return null;
	let topPanel = panels[panels.length-1];
	let dimmer = topPanel.dismissOnTap ? <PanelUIDimmer onClick={onPop} /> : null;
	let sheets = panels.map((panel, i) => <PanelSheet key={i} position={panel.position}>{panel.renderFunc()}</PanelSheet>);
	return <div className='PanelStack'>{dimmer}{sheets}</div>;
}

let PanelUIDimmer = ({onClick}) => {
	return <div className='PanelUIDimmer' onClick={onClick} />;
}

let PanelSheet = ({position, children}) => {
	return <div className={'PanelSheet position-' + (position)}>{children}</div>;
}
