import React, { Component } from 'react';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Button, Loader } from './UI.js';

// https://console.firebase.google.com/u/0/project/bigeditor-532e2/authentication/providers

let initResult = null;
export let initFirebase = () => {
	if (!initResult) {
	  let config = {
	    apiKey: "AIzaSyBQWWraPlsm-5n6KiJW--5QoIvvEWUeU7A",
	    authDomain: "bigeditor-532e2.firebaseapp.com",
	    databaseURL: "https://bigeditor-532e2.firebaseio.com",
	    projectId: "bigeditor-532e2",
	    storageBucket: "bigeditor-532e2.appspot.com",
	    messagingSenderId: "719750287594"
	  };
	  firebase.initializeApp(config);
		initResult = {firestore: firebase.firestore()};
	}
	return initResult;
}

export class UserObserver extends Component {
	constructor(props) {
		super(props);
		this.state = {user: null, loaded: false};
	}
	componentDidMount() {
		this.unsub = firebase.auth().onAuthStateChanged((user) => {
			this.setState({user: user, loaded: true});
		})
	}
	componentWillUnmount() {
		if (this.unsub) {
			this.unsub();
			delete this.unsub;
		}
	}
	render() {
		if (this.state.loaded) {
			return this.props.render(this.state.user);
		} else {
			return null;
		}
	}
}

let provider = new firebase.auth.GoogleAuthProvider();

export class LoginButton extends Component {
	constructor(props) {
		super(props);
		this.state = {loading: false};
	}
	render() {
		if (this.state.loading) {
			return <Button disabled><Loader /> Log in with Google</Button>
		} else {
			return <Button onClick={this.login.bind(this)}>Log in with Google</Button>;
			
		}
	}
	login() {
		this.setState({loading: true});
		firebase.auth().signInWithPopup(provider).then(() => {
			this.setState({loading: false});
		}).catch(() => {
			this.setState({loading: false});
		})
	}
}

export let LogoutButton = () => {
	let logout = () => {
		firebase.auth().signOut();
	}
	return <Button onClick={logout}>Log out</Button>;
}

