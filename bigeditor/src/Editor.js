import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import ClaimSiteView from './ClaimSiteView';
import { LogoutButton } from './FirebaseIntegration';
import PageView from './PageView';

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
