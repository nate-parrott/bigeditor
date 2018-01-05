import React, { Component } from 'react';
import { ElementList } from '../ContentView';
import './css/HScrollElement.css';

export class HScrollElement extends Component {
	constructor(props) {
		super(props);
		this.state = {editing: false};
	}
	render() {
		let { editable, configurable, contentModel, id } = this.props;
		// contentModel, elementListName, canEdit, canConfigure
		return (
			<div className='HScrollElement'>
				<ElementList contentModel={contentModel} elementListName={id} canEdit={editable} canConfigure={configurable} horizontal={true} />
			</div>
		)
	}
}

export default HScrollElement;
