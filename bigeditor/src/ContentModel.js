/*

CONTENT STRUCTURE:
Content is divided into:
- `view` (only configurable by the editor, inherently trusted)
- `data` (editable by untrusted users)

VIEW JSON STRUCTURE:
{
	elements: {
		elementId: {
			type: 'text|image|placeholder',
			dataName: 'arbitrary name',
			<other properties like color, scripts, etc>
		},
		elementId2: <etc>
	},
	rootElements: [<element ID>, <element ID>, etc...]
}

DATA JSON STRUCTURE:
{
	dataName: value,
	dataName2: value
}

*/

import uuidv4 from 'uuid/v4';
import { kvPair } from './utils';

export default class ContentModel {
	constructor(viewRef, dataRef, view, data) {
		this.viewRef = viewRef;
		this.dataRef = dataRef;
		this.view = view || { elements: {}, elementLists: {root: []} };
		this.data = data || {};
	}
	addElement(viewJson, dataJson, nameBase, elementListName, index) {
		let dataName = this.getUniqueDataName(nameBase);
		let elementId = uuidv4();
		
		viewJson = {...viewJson, dataName};
		
		this.updateData((oldData) => {
			let updated = {...oldData};
			updated[dataName] = dataJson;
			return updated;
		});
		
		this.updateView((oldView) => {
			let elementList = (oldView.elementLists[elementListName] || []).slice();
			elementList.splice(index, 0, elementId);
			return {
				...oldView,
				elements: {...oldView.elements, ...kvPair(elementId, viewJson)},
				elementLists: {...oldView.elementLists, ...kvPair(elementListName, elementList)}
			}
		});
	}
	appendElement(viewJson, dataJson, nameBase) {
		this.addElement(viewJson, dataJson, nameBase, 'root', this.view.elementLists.root.length);
	}
	getUniqueDataName(name) {
		let allNames = {};
		for (let elementId in (this.view.elements || {})) allNames[this.view.elements[elementId].dataName] = 1;
		let i = 0;
		while (true) {
			let proposedName = name + (i ? i : '');
			if (!allNames[proposedName]) {
				return proposedName;
			}
			i += 1;
		} 
	}
	updateData(fn) {
		this.data = fn(this.data);
		this.dataRef.set(this.data);
	}
	updateView(fn) {
		this.view = fn(this.view);
		this.viewRef.set(this.view);
	}
	moveElementIdWithinList(elementId, elementListName, oldIndex, index) {
		this.updateElementList(elementListName, (elementList) => {
			elementList = elementList.slice();
			elementList.splice(oldIndex, 1);
			if (index > oldIndex) index--;
			elementList.splice(index, 0, elementId);
			return elementList;
		});
	}
	insertElementIdIntoList(elementId, elementListName, index) {
		this.updateElementList(elementListName, (elementList) => {
			elementList = elementList.slice();
			elementList.splice(index, 0, elementId);
			return elementList;
		});
	}
	removeElementIdFromList(elementId, elementListName) {
		this.updateElementList(elementListName, (elementList) => {
			return elementList.filter((id) => id !== elementId);
		});
	}
	updateElementList(elementListName, func) {
		this.updateView((oldView) => {
			let elementList = func(oldView.elementLists[elementListName] || []);
			return {...oldView, elementLists: {...oldView.elementLists, ...kvPair(elementListName, elementList)}};
		});
	}
	updateElementView(elementId, view) {
		this.updateView((oldView) => {
			return {...oldView, elements: {...oldView.elements, ...kvPair(elementId, view)}};
		})
	}
	updateDataByName(name, value) {
		this.updateData((oldData) => {
			return {...oldData, ...kvPair(name, value)};
		});
	}
}
