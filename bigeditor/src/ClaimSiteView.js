import React from 'react';
import { Link } from 'react-router-dom';
import UserStatusObserver from './UserStatusObserver';
import { Button, FullyCentered } from './UI';
import { LoginButton, LogoutButton } from './FirebaseIntegration';
import { initFirebase } from './FirebaseIntegration';
import { getSubdomain } from './utils';

let ClaimSiteView = () => {
	return <UserStatusObserver render={({user, siteEditors}) => {
		if (user && siteEditors.indexOf(user.uid) > -1) {
			return <YouAreAnEditorView />;
		} else if (siteEditors.length > 0) {
			return <AlreadyClaimedView user={user} />;
		} else if (user) {
			return <ClaimThisSiteView user={user} />;
		} else {
			return <LogInToClaimView />;
		}
	}} />
}

export default ClaimSiteView;

let LogInToClaimView = () => {
	return (
		<FullyCentered>
			<h1>Get started creating your site!</h1>
			<LoginButton />
		</FullyCentered>
	)
}

let ClaimThisSiteView = ({user}) => {
	let claimSite = () => {
		let siteRef = initFirebase().firestore.collection('projects').doc(getSubdomain());
		siteRef.set({
			editors: [user.uid]
		}).then(() => {
			// window.location = '/';
		}).catch((e) => {
			alert("An error occurred");
		})
	}
	return (
		<FullyCentered>
			<h1>Get started creating your site!</h1>
			<Button onClick={claimSite}>Get Started</Button>
		</FullyCentered>
	)
}

let AlreadyClaimedView = ({user}) => {
	let button = user ? <LogoutButton /> : <LoginButton />;
	return (
		<FullyCentered>
			<h1>Someone has already claimed this URL</h1>
			{button}
		</FullyCentered>
	)
}

let YouAreAnEditorView = () => {
	return (
		<FullyCentered>
			<h1>You’re an editor of {getSubdomain()}.42pag.es!</h1>
			<Link to='/'><Button>Start Editing</Button></Link>
		</FullyCentered>
	)
}
