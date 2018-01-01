import React, { Component } from 'react';
import sanitizeHtml from 'sanitize-html';

export default class EditableText extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.html !== this.presentedHTML;
	}
	render() {
		let html = this.props.html;
		if (this.props.sanitized) {
			html = sanitizeHtml(this.props.html || "");
		}
		this.presentedHTML = html;
		return (
			<div className='EditableText' contentEditable dangerouslySetInnerHTML={{__html: html}} onInput={this.change.bind(this)} ref={(d) => this.div = d} />
		);
	}
	change(e) {
		let html = e.target.innerHTML;
		this.presentedHTML = html;
		this.props.onChange(html);
	}
}
