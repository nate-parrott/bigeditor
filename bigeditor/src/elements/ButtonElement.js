import React, { Component } from 'react';
import './css/ButtonElement.css';

export class ButtonElement extends Component {
	constructor(props) {
		super(props);
		this.state = {editing: false};
	}
	render() {
		let {editable, configurable, view, data, onChangeView, onChangeData } = this.props;
		return (
			<div className='ButtonElement'>{data.title || 'Button'}</div>
		)
	}
}

export default ButtonElement;
