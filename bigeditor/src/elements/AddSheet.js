import React from 'react';
import { PropertyEditor, PropertyEditorGroup } from '../PropertyEditor';
import './css/AddSheet.css';
import { Draggable } from '../DragonDrop';

let elementGroups = [
	{
		name: 'Content',
		items: [
			{view: {type: 'text'}, data: {untrustedHTML: '<h1>hello, world!</h1>'}, label: 'Title', icon: 'font'},
			{view: {type: 'text'}, data: {untrustedHTML: '<p>hello, world!</p>'}, label: 'Text', icon: 'font'},
			{view: {type: 'image', mode: 'normal'}, data: {url: null, aspectRatio: 1.618}, label: 'Image', icon: 'picture-o'},			
		]
	},
	{
		name: 'Interactivity',
		items: [
			{view: {type: 'placeholder'}, data: {}, label: 'Button', icon: 'square-o'},			
			{view: {type: 'placeholder'}, data: {}, label: 'Form', icon: 'check-square-o'},			
			{view: {type: 'placeholder'}, data: {}, label: 'Comments', icon: 'commenting-o'},			
			{view: {type: 'placeholder'}, data: {}, label: 'Like', icon: 'thumbs-up'}
		]
	},
	{
		name: 'Groupings',
		items: [
			{view: {type: 'placeholder'}, data: {}, label: 'Grid', icon: 'th-large'},
			{view: {type: 'placeholder'}, data: {}, label: 'HScroll', icon: 'ellipsis-h'},
			{view: {type: 'placeholder'}, data: {}, label: 'PhotoBG', icon: 'picture-o'}
		]
	}
]

let AddSheet = ({ onAdd }) => {
	return (
		<PropertyEditor>
			{elementGroups.map((group, i) => <AddSheetElementGroup key={i} group={group} />)}
		</PropertyEditor>
	)
}

export default AddSheet;

let AddSheetElementGroup = ({group}) => {
	let {name, items} = group;
	return <PropertyEditorGroup title={name}>{items.map((item, i) => <AddSheetItem key={i} item={item} /> )}</PropertyEditorGroup>;
}

let AddSheetItem = ({item}) => {
	let dropData = {type: 'new', view: item.view, data: item.data, nameBase: item.label};
	return (
		<Draggable dropData={dropData} onDraggedAway={() => {}}>
			<div className='AddSheetItem'>
				<span className={`fa fa-${item.icon}`} aria-hidden />
				<label>{item.label}</label>
			</div>
		</Draggable>
	)
}
