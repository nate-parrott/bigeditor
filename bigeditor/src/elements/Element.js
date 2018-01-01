import React, { Component } from 'react';
import elementForKey from './elementForKey';
import './css/Element.css';

export default class Element extends Component {
	render() {
		let {editable, configurable, data, view, onChangeData, onChangeView} = this.props;
		let Component = elementForKey(view.type);
		return <Component view={view} data={data} editable={editable} configurable={configurable} onChangeData={onChangeData} onChangeView={onChangeView} />;
	}
}
