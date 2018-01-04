import React, { Component } from 'react';
import { distance, distanceFromLineSegment } from './geometry';
import './css/DragonDrop.css';

/*
🐉 DRAGON DROP 🐉
A fun library for dragging and dropping things.

How to use Dragon Drop:

1. Wrap anything draggable in a <Draggable></Draggable> component. Supply a `dropData` JSON and an `onDraggedAway` callback.

2. Insert drop targets using <Droppable />. Droppables default to horizontal lines; set `vertical={true}` if necessary. Supply an `onDrop` callback.

3. When a drop occurs, `onDrop()` will be called with the `Draggable`'s `dropData.` If it returns `true`, then the `Draggable`'s `onDraggedAway` will be called. These callbacks should be used to modify the app's state to reflect the drag that just occurred.

// TODO:

- implement DropGroups, to restrict which Draggables and Droppables can interact.

- support dragging external files onto <Droppable /> targets.

*/

export class DDTest extends Component {
	constructor(props) {
		super(props);
		this.state = {
			containers: {
				colors: ['red', 'blue'],
				fruits: ['plum', 'pear', 'strawberry', 'starfruit', 'peach', 'banana'],
				animals: ['duck', 'turtle']
			}
		}
	}
	render() {
		let c = this.state.containers;
		let groups = [];
		for (let groupName in c) {
			let draggedAway = (data) => {
				this.removeItemFromGroup(data, groupName);
			}
			let items = c[groupName].map((word) => <Draggable key={word} dropData={word} onDraggedAway={draggedAway}>{word}</Draggable>);
			let onDrop = (idx, data) => {
				if (this.state.containers[groupName].indexOf(data) > -1) {
					this.moveItemWithinGroup(groupName, data, idx);
					return false; // return false b/c we handled the removal as well as the insertion
				} else {
					this.addItemToGroup(data, groupName, idx);
					return true; // return true b/c we need `onDraggedAway` to be called so that the item can be removed from its old parent
				}
			}
			groups.push(<div key={groupName} className={`group group-${groupName}`}>{insertDroppablesBetweenItems(items, onDrop)}</div>);
		}
		return (
			<div className='DDTest'>
				{groups}
			</div>
		)
	}
	addItemToGroup(item, groupName, index) {
		this.setState(({containers}) => {
			containers = {...containers};
			let newGroup = [...containers[groupName]];
			newGroup.splice(index, 0, item);
			containers[groupName] = newGroup;
			return {containers};
		});
	}
	removeItemFromGroup(item, groupName) {
		this.setState(({containers}) => {
			containers = {...containers};
			containers[groupName] = containers[groupName].filter((x) => x !== item);
			return {containers};
		});
	}
	moveItemWithinGroup(groupName, data, toIndex) {
		this.setState(({containers}) => {
			containers = {...containers};
			let group = [...containers[groupName]];
			let oldIdx = group.indexOf(data);
			group.splice(oldIdx, 1);
			if (toIndex > oldIdx) toIndex--;
			group.splice(toIndex, 0, data);
			containers[groupName] = group;
			return {containers};
		});
	}
}

class GlobalScrollCanceller {
	constructor(props) {
		this.shouldCancel = false;
		document.body.addEventListener('touchmove', (e) => {
			if (this.shouldCancel) {
				e.preventDefault();
				e.stopPropagation();
			}
		}, {passive: false});
	}
}
let globalScrollCanceller = new GlobalScrollCanceller();

export class Draggable extends Component {
	// props: {children, dropData, onDraggedAway}
	// LIFECYCLE:
	constructor(props) {
		super(props);
		this.state = {dragging: false};
		
		this.dragging = false;
		this.globalTrackingEnabled = false;
		this.lastPos = null;
		
		this.mousemoveBound = this.mousemove.bind(this);
		this.mouseupBound = this.mouseup.bind(this);
		this.touchmoveBound = this.touchmove.bind(this);
		this.touchendBound = this.touchend.bind(this);
		
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
			el.addEventListener('touchstart', this.touchstart.bind(this), {passive: false});			
		}
	}
	// EVENT HANDLERS:
	mousedown(e) {
		this.pointerdown({x: e.clientX, y: e.clientY}, 200);
	}
	mousemove(e) {
		let pos = {x: e.clientX, y: e.clientY};
		this.pointermove(pos, e);
	}
	mouseup(e) {
		this.pointerup(e);
	}
	touchstart(e) {
		this.pointerdown({x: e.touches[0].clientX, y: e.touches[0].clientY}, 500);
	}
	touchmove(e) {
		let pos = {x: e.touches[0].clientX, y: e.touches[0].clientY};
		this.pointermove(pos, e);
	}
	touchend(e) {
		this.pointerup(e);
	}
	pointerdown(pos, dragDelayMs) {
		this.clearDrag();
		this.enableGlobalTracking(true);
		this.startDragAfterDelay(200);
		this.initialPos = pos;
		this.updatePos(pos);
	}
	pointermove(pos, e) {
		if (distance(pos, this.initialPos) > 5) {
			this.hasMoved = true;
		}
		this.updatePos(pos);
		if (this.dragging) {
			e.preventDefault();
			e.stopPropagation();
			if (this.hasMoved) {
				this.setCurDropTarget(findDropTarget(pos));
			}
		}
	}
	pointerup(e) {
		if (this.dragging && this.hasMoved) {
			e.preventDefault();
		}
		if (this.curDropTarget) {
			if (this.curDropTarget.props.onDrop(this.props.dropData)) {
				this.props.onDraggedAway(this.props.dropData);
			}
		}
		this.clearDrag();
	}
	// EVENT HANDLER MANAGEMENT:
	enableGlobalTracking(enabled) {
		// enables/disables global tracking of mousemove and mouseup
		if (this.globalTrackingEnabled !== enabled) {
			this.globalTrackingEnabled = enabled;
			if (enabled) {
				document.body.addEventListener('mousemove', this.mousemoveBound, {passive: false});
				document.body.addEventListener('touchmove', this.touchmoveBound, {passive: false});
				document.body.addEventListener('mouseup', this.mouseupBound);
				document.body.addEventListener('touchend', this.touchendBound);
			} else {
				document.body.removeEventListener('mousemove', this.mousemoveBound);
				document.body.removeEventListener('touchmove', this.touchmoveBound);
				document.body.removeEventListener('mouseup', this.mouseupBound);
				document.body.removeEventListener('touchend', this.touchendBound);
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
		// stop scrolling:
		globalScrollCanceller.shouldCancel = true;
		// add mousemove events:
		if (this.el) {
			this.el.addEventListener('mousemove', this.mousemoveBound, {passive: false});
			this.el.hasMousemoveHandler = true;
			this.updatePos(this.pos);
			// start tracking ticks to scroll the window:
			this.lastTickTime = performance.now();
			this.tick();
		}
	}
	clearDrag() {
		globalScrollCanceller.shouldCancel = false;
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
		// cancel drag ticker:
		if (this.tickHandle) {
			cancelAnimationFrame(this.tickHandle);
			this.tickHandle = null;
		}
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
	// Drag ticks
	tick() {
		let now = performance.now();
		let dt = now - this.lastTickTime;
		this.lastTickTime = now;
		this.tickHandle = requestAnimationFrame(this.tick.bind(this));
		if (dt && this.pos) {
			let scrollThresh = Math.min(150, window.innerHeight * 0.15);
			let scrollAmount = (distFromEdge) => {
				return Math.max(0, 1 - distFromEdge / scrollThresh);
			}
			let scrollUp = scrollAmount(this.pos.y);
			let scrollDown = scrollAmount(window.innerHeight - this.pos.y);
			let maxScrollSpeed = 400; // 100 pixels per sec
			let k = maxScrollSpeed * dt / 1000;
			if (scrollUp) {
				window.scrollBy(0, -scrollUp * k);
			} else if (scrollDown) {
				window.scrollBy(0, scrollDown * k);				
			}
		}
	}
}

export let insertDroppablesBetweenItems = (items, callback) => {
	// callback: (idx, dropData) -> accept/reject drop
	// if `true` is returned, the `Draggable`'s `onDraggedAway` method will be invoked.
	// if `callback` already handles removal of the old item, return false.
	let makeCallback = (idx) => { return (dropData) => callback(idx, dropData); };
	let newItems = [<Droppable onDrop={makeCallback(0)} key={`drop-target-0}`} />];
	let i = 0;
	for (let item of items) {
		newItems.push(item);
		i += 1;
		newItems.push(<Droppable onDrop={makeCallback(i)} key={`drop-target-${i}`} />);
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

export class Droppable extends Component {
	// props: onDrop(dropData) -> true or false, depending on whether the drop is accepted or rejected
	constructor(props) {
		super(props);
		this.state = {active: false};
	}
	render() {
		let direction = this.props.vertical ? 'vertical' : 'horizontal';
		let className = `Droppable ${direction} ${this.state.active ? 'active' : ''}`;
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

