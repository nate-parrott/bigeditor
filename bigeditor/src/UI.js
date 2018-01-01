import React from 'react';
import './css/UI.css';

export let Button = ({onClick, children, label, submit}) => {
	if (submit) {
		return <input className='Button' type='submit' value={label} />;
	}
	return <div className='Button' onClick={onClick}>{children || label}</div>;
}

export let FullyCentered = ({children}) => {
	return <div className='FullyCentered'><div>{children}</div></div>;
}

export let Loader = () => {
	return <span className='Loader' role='img' aria-label='Loading'>🔄</span>;
}

export let TextField = ({ value, onChange, disableAutoCorrect, placeholder }) => {
	let extraProps = {placeholder};
	if (disableAutoCorrect) extraProps = {...extraProps, autoCorrect: 'off', autoComplete: 'off', autoCapitalize: 'off', spellCheck: 'false'};
	return <input className='TextField' type='text' {...extraProps} value={value} onChange={(e) => onChange(e.target.value)} />
}

export let FloatingButton = ({ onClick, children }) => {
	return <div className='FloatingButton' onClick={onClick}><div>{children}</div></div>;
}
