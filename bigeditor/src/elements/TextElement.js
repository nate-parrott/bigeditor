import React from 'react';
import EditableText from '../EditableText';
import './css/TextElement.css';

let TextElement = ({editable, configurable, view, data, onChangeView, onChangeData}) => {
	data = data || {};
	let updateHTML = (html) => {
		onChangeData({...data, untrustedHTML: html});
	}
	return (
		<div className='TextElement'>
			<EditableText sanitized html={data.untrustedHTML} onChange={updateHTML} />
		</div>
	)
}

export default TextElement;
