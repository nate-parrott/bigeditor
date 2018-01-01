import React, { Component } from 'react';
import { FullyCentered, Button, TextField } from './UI';
import './css/LandingPage.css';

export default class LandingPage extends Component {
	constructor(props) {
		super(props);
		this.state = {subdomain: ''};
	}
	render() {
		let wave = <span role='img' aria-label="Waving">👋</span>;
		return (
			<FullyCentered>
				<div className='LandingPage'>
					<h1>{wave} hi there!</h1>
					<form onSubmit={this.submit.bind(this)}>
						<div className='domainField'>
							<TextField disableAutoCorrect={true} value={this.state.subdomain} onChange={this.changeSubdomain.bind(this)} placeholder="xyz" /><label>.42pag.es</label>
						</div>
						<Button label="Create Site" submit />
					</form>
				</div>
			</FullyCentered>
		)
	}
	changeSubdomain(text) {
		this.setState({subdomain: text.toLowerCase().replace(/ /g, '-').replace(/[/.]+/g, '')});
	}
	submit(e) {
		e.preventDefault();
		if (this.state.subdomain) {
			window.location.href = window.location.protocol + '//' + this.state.subdomain + '.' + window.location.host + '/__create';
		}
	}
}
