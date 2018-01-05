import React from 'react';
import TextElement from './TextElement';
import ImageElement from './ImageElement';
import ButtonElement from './ButtonElement';
import HScrollElement from './HScrollElement';
import './css/PlaceholderElement.css';

let PlaceholderElement = ({editable, configurable}) => {
	let desc = "editable: " + (editable ? 'yes' : 'no') + '; configurable: ' + (configurable ? 'yes' : 'no'); 
	return <div className='PlaceholderElement'><div><h1>[placeholder]</h1><p>{desc}</p></div></div>;
}

export default function elementForKey(key) {
	let elements = {
		text: TextElement,
		image: ImageElement,
		button: ButtonElement,
		hscroll: HScrollElement
	};
	return elements[key] || PlaceholderElement;
}
