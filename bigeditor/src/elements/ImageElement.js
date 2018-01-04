import React from 'react';
import { PropertyEditor, PropertyEditorGroup, PropertyEditorItemMargin, UploadImageButton } from '../PropertyEditor';
import { Checkbox } from '../UI';
import { Panel } from '../Panels';
import './css/ImageElement.css';
console.log(React.version);

let ImageElement = ({editable, configurable, view, data, onChangeView, onChangeData, panelMgr}) => {
	let style = {paddingBottom: 100 / data.aspectRatio + '%'};
	let className = `ImageElement mode-${view.mode}`;
	let img = null;
	if (data.url) {
		img = <img src={data.url} alt="" />;
	}
	let edit = () => {
		if (editable) {
			panelMgr.push(new Panel(() => {
				return <ImageElementPropertyEditor data={data} view={view} onChangeData={onChangeData} onChangeView={onChangeView} configurable={configurable} />;
			}, {dimsUI: true, noPadding: true}));
		}
	}
	return (
		<div className={className} onClick={edit}>
			<div className='imageWrapper' style={style}>{img}</div>
		</div>
	)
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
				<Checkbox value={data.mode === 'full-bleed'} onToggle={toggleFullBleed}>Full-bleed</Checkbox>
			</PropertyEditorItemMargin>
		</PropertyEditorGroup>);
	}
	return <PropertyEditor>{groups}</PropertyEditor>;
}

