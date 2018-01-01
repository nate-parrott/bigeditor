import { Component } from 'react';
import * as firebase from 'firebase';
import { initFirebase } from './FirebaseIntegration';
import { getSubdomain } from './utils';

export default class UserStatusObserver extends Component {
	constructor(props) {
		super(props);
		this.siteRef = initFirebase().firestore.collection('projects').doc(getSubdomain());
		this.state = {
			user: null,
			userLoaded: false,
			siteEditors: [],
			siteEditorsLoaded: false
		}
	}
	componentDidMount() {
		this.unsubs = [
			firebase.auth().onAuthStateChanged((user) => {
				this.setState({user: user, userLoaded: true});
			}),
			this.siteRef.onSnapshot((doc) => {
				let siteEditors = doc.exists ? (doc.data().editors || []) : [];
				this.setState({siteEditors, siteEditorsLoaded: true});
			})
		]
	}
	componentWillUnmount() {
		for (let fn of this.unsubs) fn();
		this.unsubs = [];
	}
	render() {
		if (this.state.userLoaded && this.state.siteEditorsLoaded) {
			let {user, siteEditors} = this.state;
			return this.props.render({user, siteEditors});
		} else if (this.props.renderBeforeReady) {
			return this.props.render({});
		} else {
			return null;
		}
	}
 }
