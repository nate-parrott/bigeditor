import React, { Component } from 'react';
import { PropertyEditor, PropertyEditorGroup, PropertyEditorItemMargin, UploadImageButton } from '../PropertyEditor';
import { Checkbox } from '../UI';
import { ModalPanel } from '../Panels';
import seed from 'seed-random';
import './css/ImageElement.css';

export class ImageElement extends Component {
	constructor(props) {
		super(props);
		this.state = {editing: false};
	}
	render() {
		let { editable, configurable, view, data, onChangeView, onChangeData, id } = this.props;
		
		let style = {
			paddingBottom: 100 / data.aspectRatio + '%'
		};
		let className = `ImageElement mode-${view.mode} greedy-width`;
		let img = null;
		if (data.url) {
			img = <img src={data.url} alt="" />;
		} else {
			let rand = seed(id);
			let hue = (rand() * 360) | 0;
			style.backgroundImage = `linear-gradient(135deg, hsl(${hue}, 80%, 80%), hsl(${hue}, 100%, 50%))`;
		}
		
		let edit = () => {
			if (editable) {
				this.setState({editing: true});
			}
		}
		
		let editor = null;
		if (this.state.editing) {
			editor = <ImageElementPropertyEditor data={data} view={view} onChangeData={onChangeData} onChangeView={onChangeView} configurable={configurable} />;
			editor = <ModalPanel key='editor' padding={false} onDismiss={() => this.setState({editing: false})} dimsUI>{editor}</ModalPanel>;
		}
		
		return (
			<div className={className}>
				<div className='imageWrapper' style={style} onClick={edit}>{img}</div>
				{ editor }
			</div>
		)
	}
}

export default ImageElement;

let ImageElementPropertyEditor = ({ data, view, onChangeData, onChangeView, configurable }) => {
	let updateImage = ({url, aspectRatio}) => onChangeData({...data, url, aspectRatio});
	let groups = [
		<PropertyEditorGroup title="Image" key="image">
			<PropertyEditorItemMargin>
				<UploadImageButton value={data.url} onUpload={updateImage} />
			</PropertyEditorItemMargin>
		</PropertyEditorGroup>
	];
	if (configurable) {
		let toggleFullBleed = () => {
			onChangeView({...view, mode: (view.mode === 'normal') ? 'full-bleed' : 'normal'});
		}
		groups.push(<PropertyEditorGroup title="Appearance" key="appearance">
			<PropertyEditorItemMargin>
				<Checkbox value={view.mode === 'full-bleed'} onToggle={toggleFullBleed}>Full-bleed</Checkbox>
			</PropertyEditorItemMargin>
		</PropertyEditorGroup>);
	}
	return <PropertyEditor>{groups}</PropertyEditor>;
}

