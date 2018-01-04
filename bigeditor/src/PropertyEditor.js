import React, { Component } from 'react';
import { initFirebase } from './FirebaseIntegration';
import { Button } from './UI';
import './css/PropertyEditor.css';

export let PropertyEditor = ({children}) => {
	return <div className='PropertyEditor'><div>{children}</div></div>;
}

export let PropertyEditorGroup = ({title, children}) => {
	return <div className='PropertyEditorGroup'><label>{title}</label><div className='children'>{children}</div></div>;
}

export class UploadImageButton extends Component {
	constructor(props) {
		super(props);
		this.state = {uploading: false};
    this.fileNode = null;
	}
	render() {
		let title = this.state.uploading ? 'Uploading…' : (this.props.value ? 'Replace image…' : 'Upload image…');
		return (
			<div className='UploadImageButton'>
				<Button onClick={this.click.bind(this)}><i className='fa fa-upload' aria-hidden /> {title}</Button>
        <input type='file' onChange={this.onFileChange.bind(this)} style={{display: 'none'}} ref={(n) => this.fileNode = n} />
			</div>
		)
	}
	click() {
    this.fileNode.click();
	}
	onFileChange(e) {
    if (e.target.files.length > 0) {
      this.uploadFile(e.target.files[0]);
    }
	}
	uploadFile(file) {
		// TODO
	}
}

export let PropertyEditorItemMargin = ({children}) => {
	return <div className='PropertyEditorItemMargin'>{children}</div>;
}
