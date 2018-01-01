import React from 'react';
import './UI.css';

export let Button = ({onClick, children}) => {
	return <div className='Button' onClick={onClick}>{children}</div>;
}

export let FullyCentered = ({children}) => {
	return <div className='FullyCentered'><div>{children}</div></div>;
}
