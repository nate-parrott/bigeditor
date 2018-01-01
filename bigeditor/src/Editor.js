import React, { Component } from 'react';
import { FullyCentered } from './UI';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import ClaimSiteView from './ClaimSiteView';
import { LogoutButton } from './FirebaseIntegration';

export default class Editor extends Component {
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path='/__logout' component={LogoutButton} />
					<Route exact path='/__create' component={ClaimSiteView} />
					<Route path='/' component={PageView} />
				</Switch>
			</BrowserRouter>
		)
	}
}

let PageView = () => {
	return <FullyCentered><h1>hi</h1></FullyCentered>;
}
