import React, { Component } from 'react';
import { FullyCentered } from './UI';
import { UserObserver, LoginButton, LogoutButton } from './FirebaseIntegration';

export default class LandingPage extends Component {
	render() {
		let wave = <span role='img' aria-label="Waving">👋</span>;
		return (
			<FullyCentered>
				<UserObserver render={(user) => {
					if (user) {
						return (
							<div>
								<h1>{wave} hi, {user.displayName.split(' ')[0]}!</h1>
								<LogoutButton />
							</div>
						);
					} else {
						return (
							<div>
								<h1>{wave} sign up!</h1>
								<LoginButton />
							</div>
						);
					}
				}} />
			</FullyCentered>
		)
	}
}
