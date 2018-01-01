import React from 'react';
import './css/UI.css';

export let Button = ({onClick, children}) => {
	return <div className='Button' onClick={onClick}>{children}</div>;
}

export let FullyCentered = ({children}) => {
	return <div className='FullyCentered'><div>{children}</div></div>;
}

export let Loader = () => {
	return <span className='Loader' role='img' aria-label='Loading'>🔄</span>;
}
