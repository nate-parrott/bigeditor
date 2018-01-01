export default class ContentModel {
	constructor(viewRef, dataRef, view, data) {
		this.viewRef = viewRef;
		this.dataRef = dataRef;
		this.view = view || {};
		this.elements = this.view.elements || [];
		this.data = data || {};
	}
	appendElement(viewJson, dataJson, nameBase) {
		let name = this.getUniqueName(nameBase);
		viewJson = {...viewJson, name};
		
		let newData = {...this.data};
		newData[name] = dataJson;
		this.dataRef.set(newData);
		
		let newView = {...this.view, elements: [...this.elements, viewJson]};
		this.viewRef.set(newView);
	}
	getUniqueName(name) {
		let allNames = {};
		for (let view of this.elements) allNames[view.name] = 1;
		let i = 0;
		while (true) {
			let proposedName = name + (i ? i : '');
			if (!allNames[proposedName]) {
				return proposedName;
			}
			i += 1;
		} 
	}
}
