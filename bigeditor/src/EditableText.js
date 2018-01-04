import React, { Component } from 'react';
import sanitizeHtml from 'sanitize-html';

export default class EditableText extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.html !== this.presentedHTML || nextProps.editable !== this.props.editable;
	}
	render() {
		let html = this.props.html;
		this.presentedHTML = html;
		if (this.props.sanitized) {
			html = sanitizeHtml(this.props.html || "", sanitizationSettings);
		}
		return (
			<div className='EditableText' contentEditable={this.props.editable} dangerouslySetInnerHTML={{__html: html}} onInput={this.change.bind(this)} ref={(d) => this.div = d} />
		);
	}
	change(e) {
		let html = e.target.innerHTML;
		this.presentedHTML = html;
		this.props.onChange(html);
	}
}

let sanitizationSettings = {
	allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'blockquote', 'code'])
}
