import React from 'react';
import FirebaseLoader from './FirebaseLoader';
import ContentModel from './ContentModel';
import { FloatingButton } from './UI';
import Element from './elements/Element';
import { kvPair } from './utils';
import './css/ContentView.css';

let ContentView = ({ dataRef, viewRef, canEdit, canConfigure, panelMgr, isPageRoot }) => {
	return <FirebaseLoader dbRefs={{view: viewRef, data: dataRef}} render={({view, data}) => {
		
		let contentModel = new ContentModel(viewRef, dataRef, view, data);
		let elementsById = contentModel.view.elements || {};
		let rootElementIds = contentModel.view.rootElements || [];
		
		let elementList = <ul className='elements'>{rootElementIds.map((elementId) => {
			let elementView = elementsById[elementId];
			let dataName = elementView.dataName;
			let data = contentModel.data[dataName];
			
			let onChangeData = (newVal) => {
				contentModel.updateData((oldData) => {
					return {...oldData, ...kvPair(dataName, newVal)};
				});
			};
			let onChangeView = (newView) => {
				contentModel.updateView((oldView) => {
					let elementsById = oldView.elements || {};
					return {...oldView, elements: {...elementsById, ...kvPair(elementId, newView)}};
				})
			};
			
			return <Element key={elementId} editable={canEdit} configurable={canConfigure} view={elementView} data={data} onChangeView={onChangeView} onChangeData={onChangeData} />;
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
		contentModel.appendElement({type: 'text'}, {untrustedHTML: '<p>hello, world!</p>'}, 'Text');
	};
	return (
		<div className='ConfigChrome'>
			<FloatingButton onClick={add}>+</FloatingButton>
		</div>
	);
}
