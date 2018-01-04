import React from 'react';
import FirebaseLoader from './FirebaseLoader';
import ContentModel from './ContentModel';
import { FloatingButton } from './UI';
import { Panel } from './Panels';
import Element from './elements/Element';
import { kvPair } from './utils';
import AddSheet from './elements/AddSheet';
import { insertDroppablesBetweenItems, Draggable } from './DragonDrop';
import './css/ContentView.css';

let ContentView = ({ dataRef, viewRef, canEdit, canConfigure, panelMgr, isPageRoot }) => {
	return <FirebaseLoader dbRefs={{view: viewRef, data: dataRef}} render={({view, data}) => {
		if (view === undefined || data === undefined) return null;
		let contentModel = new ContentModel(viewRef, dataRef, view.exists ? view.data() : null, data.exists ? data.data() : null);
		let classNames = ['ContentView'];
		if (isPageRoot) classNames.push('isPageRoot');
		return (
			<div className={classNames.join(' ')}>
				<ElementList contentModel={contentModel} elementListName='root' canEdit={canEdit} canConfigure={canConfigure} />
				{ (isPageRoot && canConfigure) ? <ConfigChrome contentModel={contentModel} panelMgr={panelMgr} /> : null }
			</div>
		)
	}} />;
}

export default ContentView;

let ElementList = ({ contentModel, elementListName, canEdit, canConfigure }) => {
	let elementsById = contentModel.view.elements;
	let elementIds = contentModel.view.elementLists[elementListName] || [];
	
	let elements = elementIds.map((elementId) => {
		let elementView = elementsById[elementId];
		let dataName = elementView.dataName;
		let data = contentModel.data[dataName];
		
		let onChangeData = (newVal) => {
			contentModel.updateData((oldData) => {
				return {...oldData, ...kvPair(dataName, newVal)};
			});
		};
		let onChangeView = (newView) => {
			contentModel.updateElementView(elementId, newView);
		};
		
		let el = <Element key={elementId} editable={canEdit} configurable={canConfigure} view={elementView} data={data} onChangeView={onChangeView} onChangeData={onChangeData} />;
		if (canConfigure) {
			let dropData = {type: 'move', elementId: elementId, view: elementView, data: data};
			let draggedAway = () => {
				contentModel.removeElementIdFromList(elementId, elementListName);
			};
			return <Draggable dropData={dropData} onDraggedAway={draggedAway}>{el}</Draggable>;
		} else {
			return el;
		}
	});
	
	if (canConfigure) { // add drop targets:
		elements = insertDroppablesBetweenItems(elements, (index, dropData) => {
			if (dropData.type === 'new') {
				let {view, data, nameBase} = dropData;
				contentModel.addElement(view, data, nameBase, 'root', index);
				return true;
			} else if (dropData.type === 'move') {
				let {elementId, view, data} = dropData;
				if (elementIds.indexOf(elementId) > -1) {
					// move this element within this list:
					let oldIndex = elementIds.indexOf(elementId);
					contentModel.moveElementIdWithinList(elementId, elementListName, oldIndex, index);
					return false;
				} else {
					// add this element to this list:
					contentModel.insertElementIdIntoList(elementId, elementListName, index);
					contentModel.updateElementView(elementId, view);
					if (!contentModel.data[view.dataName]) {
						contentModel.updateDataByName(view.dataName, data);
					}
					return true;
				}
			}
			return false;
		});
	}
	
	return <ul className='ElementList'>{elements}</ul>;
}

let ConfigChrome = ({ panelMgr, contentModel }) => {
	let add = () => {
		panelMgr.push(new Panel(() => {
			return <AddSheet />;
		}, {dimsUI: false, noPadding: true}));
		// contentModel.appendElement({type: 'text'}, {untrustedHTML: '<p>hello, world!</p>'}, 'Text');
	};
	return (
		<div className='ConfigChrome'>
			<FloatingButton onClick={add}>+</FloatingButton>
		</div>
	);
}
