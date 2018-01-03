import React, { Component } from 'react';
import { distance, distanceFromLineSegment } from './geometry';
import './css/DragonDrop.css';

export class DDTest extends Component {
	constructor(props) {
		super(props);
		this.state = {
			containers: {
				colors: ['red', 'blue'],
				fruits: ['plum', 'pear', 'strawberry'],
				animals: ['duck', 'turtle']
			}
		}
	}
	render() {
		let c = this.state.containers;
		let groups = [];
		for (let groupName in c) {
			let items = c[groupName].map((word) => <Draggable key={word}>{word}</Draggable>);
			let onDrop = (idx) => {
				// TODO
			}
			groups.push(<div key={groupName} className={`group group-${groupName}`}>{insertDropTargetsBetweenItems(items, onDrop)}</div>);
		}
		return (
			<div className='DDTest'>
				{groups}
			</div>
		)
	}
}

class Draggable extends Component {
	// LIFECYCLE:
	constructor(props) {
		super(props);
		this.state = {dragging: false};
		
		this.dragging = false;
		this.globalTrackingEnabled = false;
		this.lastPos = null;
		
		this.mousemoveBound = this.mousemove.bind(this);
		this.mouseupBound = this.mouseup.bind(this);
		
		this.curDropTarget = null;
	}
	componentWillUnmount() {
		this.clearDrag();
	}
	render() {
		let style = {opacity: this.state.dragging ? 0.5 : 1};
		return <div className='Draggable' style={style} ref={(el) => this.gotElement(el)}>{this.props.children}</div>;
	}
	gotElement(el) {
		if (!el) return;
		this.el = el;
		if (!el._hasEventListeners) {
			el._hasEventListeners = true;
			el.addEventListener('mousedown', this.mousedown.bind(this), {passive: false});
			el.addEventListener('mouseup', this.mouseup.bind(this), {passive: false});
		}
	}
	// EVENT HANDLERS:
	mousedown(e) {
		this.clearDrag();
		this.enableGlobalTracking(true);
		this.startDragAfterDelay(200);
		this.initialPos = {x: e.clientX, y: e.clientY};
		this.updatePos(this.initialPos);
	}
	mousemove(e) {
		let pos = {x: e.clientX, y: e.clientY};
		if (distance(pos, this.initialPos) > 5) {
			this.hasMoved = true;
		}
		this.updatePos(pos);
		if (this.dragging) {
			e.preventDefault();
		}
	}
	mouseup(e) {
		if (this.dragging && this.hasMoved) {
			e.preventDefault();
		}
		this.clearDrag();
	}
	// EVENT HANDLER MANAGEMENT:
	enableGlobalTracking(enabled) {
		// enables/disables global tracking of mousemove and mouseup
		if (this.globalTrackingEnabled !== enabled) {
			this.globalTrackingEnabled = enabled;
			if (enabled) {
				document.body.addEventListener('mousemove', this.mousemoveBound);
				document.body.addEventListener('mouseup', this.mouseupBound);
			} else {
				document.body.removeEventListener('mousemove', this.mousemoveBound);
				document.body.removeEventListener('mouseup', this.mouseupBound);
			}
		}
	}
	// MARK: UI
	updatePos(pos) {
		this.pos = pos;
		if (this.dragProxy) {
			this.dragProxy.style.top = this.pos.y + 'px';
			this.dragProxy.style.left = this.pos.x + 'px';
		}
		this.setCurDropTarget(findDropTarget(pos));
	}
	// DRAG STATE:
	startDragAfterDelay(ms) {
		this.hasMoved = false;
		this.dragTimeout = setTimeout(() => {
			if (!this.hasMoved) {
				this.startDrag();
			}
		}, ms);
	}
	startDrag() {
		this.dragTimeout = null;
		this.dragging = true;
		this.setState({dragging: true});
		// show drag proxy:
		this.dragProxy = document.createElement('div');
		this.dragProxy.setAttribute('class', 'DDDragProxy');
		window.document.body.appendChild(this.dragProxy);
		// add mousemove events:
		if (this.el) {
			this.el.addEventListener('mousemove', this.mousemoveBound, {passive: false});
			this.el.hasMousemoveHandler = true;
			this.updatePos(this.pos);
		}
	}
	clearDrag() {
		this.enableGlobalTracking(false);
		this.hasMoved = false;
		this.setState({dragging: false});
		// hide drag proxy:
		if (this.dragProxy) {
			this.dragProxy.parentElement.removeChild(this.dragProxy);
			this.dragProxy = null;
		}
		// cancel drag timer:
		if (this.dragTimeout) {
			clearTimeout(this.dragTimeout);
			this.dragTimeout = null;
		}
		this.dragging = false;
		// remove mousedown event
		if (this.el && this.el.hasMousemoveHandler) {
			this.el.removeEventListener('mousemove', this.mousemoveBound);
			this.el.hasMousemoveHandler = false;
		}
		this.setCurDropTarget(null);
	}
	setCurDropTarget(target) {
		if (target === this.curDropTarget) return;
		if (this.curDropTarget) {
			this.curDropTarget.setState({active: false});
		}
		this.curDropTarget = target;
		if (this.curDropTarget) {
			this.curDropTarget.setState({active: true});
		}
	}
}

export let insertDropTargetsBetweenItems = (items, callback) => {
	// callback will be called back with the INDEX of the insertion
	let makeCallback = (idx) => { return () => callback(idx); };
	let newItems = [<DDTarget onDrop={makeCallback(0)} key={`drop-target-0}`} />];
	let i = 0;
	for (let item of items) {
		newItems.push(item);
		i += 1;
		newItems.push(<DDTarget onDrop={makeCallback(i)} key={`drop-target-${i}`} />);
	}
	return newItems;
}

let dropTargets = [];
let findDropTarget = (pos) => {
	let MAX_DIST = 100;
	let results = [];
	for (let target of dropTargets) {
		let line = target.lineSegment();
		if (line) {
			let dist = distanceFromLineSegment(line[0], line[1], pos);
			if (dist <= MAX_DIST) {
				results.push({target, dist});
			}
		}
	}
	results.sort((a, b) => {
		return a.dist - b.dist;
	});
	return results.length ? results[0].target : null;
}

class DDTarget extends Component {
	constructor(props) {
		super(props);
		this.state = {active: false};
	}
	render() {
		let direction = this.props.vertical ? 'vertical' : 'horizontal';
		let className = `DDTarget ${direction} ${this.state.active ? 'active' : ''}`;
		return <div className={className} onDrop={this.props.onDrop} ref={(n) => this.node = n} />
	}
	componentDidMount() {
		dropTargets.push(this);
	}
	componentWillUnmount() {
		// remove from list of active drop targets:
		let idx = dropTargets.indexOf(this);
		if (idx > -1) dropTargets.splice(idx, 1);
	}
	lineSegment() {
		if (this.node) {
			let bounds = this.node.getBoundingClientRect();
			if (this.props.vertical) {
				return [{x: bounds.x, y: bounds.y}, {x: bounds.x, y: bounds.y + bounds.height}];
			} else {
				return [{x: bounds.x, y: bounds.y}, {x: bounds.x + bounds.width, y: bounds.y}]; 
			}
		} else {
			return null;
		}
	}
}

