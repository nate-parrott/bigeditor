import React from 'react';
import UserStatusObserver from './UserStatusObserver';
import { projectRoot } from './FirebaseIntegration';
import ContentView from './ContentView';

let PageView = ({match, location}) => {
	let pageKey = window.encodeURIComponent(location.pathname);
	let siteRef = projectRoot();
	let dataRef = siteRef.collection('data').doc(pageKey);
	let viewRef = siteRef.collection('views').doc(pageKey);
	
	return <UserStatusObserver renderBeforeReady render={({user, siteEditors}) => {
					let canConfigure = user && siteEditors && siteEditors.indexOf(user.uid) > -1;
					let canEdit = canConfigure;
					return <ContentView dataRef={dataRef} viewRef={viewRef} canConfigure={canConfigure} canEdit={canEdit} isPageRoot={true} />;
				}} />;
}

export default PageView;
