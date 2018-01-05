
export let getSubdomain = () => {
	let hostParts = window.location.host.split('.');
	if (hostParts.length === 1 || hostParts[0] === 'www' || hostParts[0] === '192') {
		return null;
	} else {
		return hostParts[0];
	}
}

export let kvPair = (key, val) => {
	let d = {};
	d[key] = val;
	return d;
}

export let getJsonPath = (item, path) => {
	return _getJsonPath(item, path, 0);
}

let _getJsonPath = (item, path, i) => {
	return i === path.length ? item : _getJsonPath(item[path[i]], path, i + 1);
}

export let setJsonPath = (item, path, val) => {
	return _setJsonPath(item, path, val, 0);
}

let _setJsonPath = (item, path, val, i) => {
	if (i === path.length) {
		return val;
	} else {
		let itemCopy = Array.isArray(item) ? item.slice() : {...item};
		itemCopy[path[i]] = _setJsonPath(itemCopy[path[i]], path, val, i + 1);
		return itemCopy;
	}
}

let assert = (cond) => {
	if (!cond) {
		throw "Assertion failed";
	}
}

let testUtils = () => {
	assert(getJsonPath(123, []) === 123);
	assert(getJsonPath([1, {xyz: 3}], [1, 'xyz']) === 3);
	assert(setJsonPath(123, [], 'one') === 'one');
	assert(setJsonPath({x: {y: [1, 2]}}, ['x', 'y', 1], 'one').x.y[1] === 'one');
	assert(setJsonPath({x: [{y: 1, v: 9}]}, ['x', 0, 'y'], -3).x[0].v === 9);
	console.log('test succeeded');
}

// testUtils();
