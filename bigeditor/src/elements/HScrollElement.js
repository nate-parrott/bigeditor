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
		let classNames = ['HScrollElement'];
		if ((contentModel.view.elementLists[id] || []).length === 0) {
			classNames.push('empty');
		}
		// contentModel, elementListName, canEdit, canConfigure
		return (
			<div className={classNames.join(' ')}>
				<ElementList contentModel={contentModel} elementListName={id} canEdit={editable} canConfigure={configurable} horizontal={true} />
			</div>
		)
	}
}

export default HScrollElement;
