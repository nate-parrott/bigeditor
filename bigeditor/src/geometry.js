export let distance = (pt1, pt2) => {
	return Math.sqrt(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2));
}

let addCoords = (a, b) => {
  return {x: a.x + b.x, y: a.y + b.y};
}

let subCoords = (a, b) => {
  return {x: a.x - b.x, y: a.y - b.y};
}

let coordTimesScalar = (a, k) => {
  return {x: a.x * k, y: a.y * k};
}

let dot = (a, b) => {
  return a.x * b.x + a.y * b.y;
}

export let closestPointOnLineSegment = (v, w, p) => {
  let l2 = Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2);
  if (l2 === 0) return v;
  
  let t = dot(subCoords(p, v), subCoords(w, v)) / l2;
  t = Math.max(0, Math.min(1, t)); // clip between 0..1
  return addCoords(v, coordTimesScalar(subCoords(w, v), t));
}

export let distanceFromLineSegment = (v, w, p) => {
	return distance(closestPointOnLineSegment(v, w, p), p);
}
