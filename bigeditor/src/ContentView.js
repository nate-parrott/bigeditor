import React from 'react';
import FirebaseLoader from './FirebaseLoader';
import ContentModel from './ContentModel';
import { FloatingButton } from './UI';
import Element from './elements/Element';
import './css/ContentView.css';

let ContentView = ({ dataRef, viewRef, canEdit, canConfigure, panelMgr, isPageRoot }) => {
	return <FirebaseLoader dbRefs={{view: viewRef, data: dataRef}} render={({view, data}) => {
		
		let contentModel = new ContentModel(viewRef, dataRef, view, data);
		
		let elementList = <ul className='elements'>{contentModel.elements.map((elementView, i) => {
			let data = contentModel.data[elementView.name];
			let key = elementView.name + '_' + elementView.type; 
			return <Element key={key} editable={canEdit} configurable={canConfigure} view={elementView} data={data} />;
		})}</ul>;
		
		let classNames = ['ContentView'];
		if (isPageRoot) classNames.push('isPageRoot');
		
		return (
			<div className={classNames.join(' ')}>
				{ elementList }
				{ (isPageRoot && canConfigure) ? <ConfigChrome contentModel={contentModel} panelMgr={panelMgr} /> : null }
			</div>
		)
	}} />;
}

export default ContentView;

let ConfigChrome = ({ panelMgr, contentModel }) => {
	let add = () => {
		contentModel.appendElement({type: 'placeholder'}, {test: 'hey'}, 'Placeholder');
	};
	return (
		<div className='ConfigChrome'>
			<FloatingButton onClick={add}>+</FloatingButton>
		</div>
	);
}
