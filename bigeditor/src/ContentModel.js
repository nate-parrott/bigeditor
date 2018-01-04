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

export default class ContentModel {
	constructor(viewRef, dataRef, view, data) {
		this.viewRef = viewRef;
		this.dataRef = dataRef;
		this.view = view || {};
		this.data = data || {};
	}
	addElement(viewJson, dataJson, nameBase, index) {
		let dataName = this.getUniqueDataName(nameBase);
		let elementId = uuidv4();
		
		viewJson = {...viewJson, dataName};
		
		this.updateData((oldData) => {
			let updated = {...oldData};
			updated[dataName] = dataJson;
			return updated;
		});
		
		this.updateView((oldView) => {
			let elementUpdate = {};
			elementUpdate[elementId] = viewJson;
			let elementList = [...(oldView.rootElements || [])];
			elementList.splice(index, 0, elementId);
			return {
				...oldView,
				rootElements: elementList,
				elements: {...oldView.elements, ...elementUpdate}
			}
		});
	}
	appendElement(viewJson, dataJson, nameBase) {
		this.addElement(viewJson, dataJson, nameBase, (this.view.rootElements || []).length);
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
}
