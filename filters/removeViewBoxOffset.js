
// draft, will need testing

const nonRendering = new Set(['linearGradient', 'radialGradient', 'pattern', 'clipPath', 'mask', 'marker', 'symbol', 'filter', 'solidColor', 'defs']);

module.exports = function removeViewBoxOffset(svg) {
	if (!svg.hasAttribute('viewBox')) return;

	var [x, y, w, h] = svg.getAttribute('viewBox').split(/[ ,]/).map(x => parseFloat(x));

	if (Math.round(x)==0 && Math.round(y)==0) return;

	svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
	for (var child of svg.children) {
		if (!nonRendering.has(child.tagName)) {
			var transform = child.getAttribute('transform') || '';

			var m = transform.match(/translate\(([^)]+)\)/);
			var m2 = transform.match(/matrix\(([^)]+)\)/);
			if (m) {
				var [x1, y1] = m[1].split(/[, ]/);
				child.setAttribute('transform', transform.slice(0,m.index)+`translate(${+x1-x} ${+y1-y})`+transform.slice(m.index+m[0].length));
			}
			
		  else if (m2) { // modify the last 2
				var xs = m2[1].split(/[, ]/), x2=xs[xs.length-2], y2=xs[xs.length-1];
				child.setAttribute('transform', transform.slice(0,m2.index)+`matrix(${xs.slice(0,-2)},${+x2-x},${+y2-y})`+transform.slice(m2.index+m2[0].length));
			}
			
			else {
				child.setAttribute('transform',`translate(${-x} ${-y}) `+transform);
			}
		}
	}
	svg.querySelectorAll('metadata').forEach(el => el.remove());
}


module.exports.active = false;

module.exports.description = 'moves the viewBox origin to 0 0';
