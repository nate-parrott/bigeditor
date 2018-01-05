import React, { Component } from 'react';
import FirebaseLoader from './FirebaseLoader';
import ContentModel from './ContentModel';
import { FloatingButton } from './UI';
import { ModalPanel } from './Panels';
import Element from './elements/Element';
import { kvPair } from './utils';
import AddSheet from './elements/AddSheet';
import { insertDroppablesBetweenItems, Draggable, Droppable } from './DragonDrop';
import './css/ContentView.css';

let ContentView = ({ dataRef, viewRef, canEdit, canConfigure, isPageRoot }) => {
	return <FirebaseLoader dbRefs={{view: viewRef, data: dataRef}} render={({view, data}) => {
		if (view === undefined || data === undefined) return null;
		let contentModel = new ContentModel(viewRef, dataRef, view.exists ? view.data() : null, data.exists ? data.data() : null);
		let classNames = ['ContentView'];
		if (isPageRoot) classNames.push('isPageRoot');
		return (
			<div className={classNames.join(' ')}>
				<ElementList contentModel={contentModel} elementListName='root' canEdit={canEdit} canConfigure={canConfigure} />
				{ (isPageRoot && canConfigure) ? <ConfigChrome contentModel={contentModel} /> : null }
			</div>
		)
	}} />;
}

export default ContentView;

let ElementList = ({ contentModel, elementListName, canEdit, canConfigure, panelMgr }) => {
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
			return <Draggable dropData={dropData} onDraggedAway={draggedAway} key={elementId}>{el}</Draggable>;
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

class ConfigChrome extends Component {
	constructor(props) {
		super(props);
		this.state = {showAdd: false};
	}
	render() {
		let trash = <Droppable className='trash' shape='box' onDrop={() => true}><FloatingButton><i className='fa fa-trash' /></FloatingButton></Droppable>;
		let add = <FloatingButton onClick={() => this.setState({showAdd: true})}><span>+</span></FloatingButton>;
		return (
			<div className='ConfigChrome'>
				{trash}
				{add}
				{this.state.showAdd ? <ModalPanel padding={false} onDismiss={() => this.setState({showAdd: false})}><AddSheet /></ModalPanel> : null}
			</div>
		);
	}
}
