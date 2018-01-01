import { Component } from 'react';

export default class FirebaseLoader extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.unsubs = [];
	}
	componentDidMount() {
		this.unsubs = [];
		for (let key in this.props.dbRefs) {
			let unsub = this.props.dbRefs[key].onSnapshot((result) => {
				let stateUpdate = {};
				stateUpdate[key] = result.exists ? result.data() : {};
				this.setState(stateUpdate);
			});
			this.unsubs.push(unsub);
		}
	}
	componentWillUnmount() {
		for (let cb of this.unsubs) cb();
		this.unsubs = [];
	}
	render() {
		return this.props.render(this.state);
	}
}
