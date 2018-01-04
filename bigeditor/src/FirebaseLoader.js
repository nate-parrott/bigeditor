import { Component } from 'react';
import { kvPair } from './utils';

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
				this.setState(kvPair(key, result));
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
