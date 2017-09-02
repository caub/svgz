const {round, roundStringValues, walk, stringifyNumbers} = require('../util');

const numRe = /\b([\-+]?\d*\.?\d+(?:[eE][\-+]?\d+)?)\b/g;
const numPxRe = /\b([\-+]?\d*\.?\d+(?:[eE][\-+]?\d+)?)(?:px|pt|pc|mm|cm|m|in|ft|em|ex|%)?\b/g;

module.exports = function cleanupNumericValues(svg, {precision}) {

	for (var i=0; i<svg.attributes.length; i++) {
		const a = svg.attributes[i];
		if (a.value) {
			svg.setAttribute(a.name, roundStringValues(a.value, precision, a.name==='style'?numRe:numPxRe));// a.value =  //works too
		} else {
			svg.removeAttribute(a.name);
		}
	}

	walk(svg, el => {
		for (var i=0; i<el.attributes.length; i++) {
			const a = el.attributes[i];
			if (!a.value) {
				el.removeAttribute(a.name);
			} else if (a.name!=='transform' && a.name!=='d') { // already treated in convertTransform/PathData
				el.setAttribute(a.name, roundStringValues(a.value, precision, a.name==='style'?numRe:numPxRe));
			}
		}
	});
}


module.exports.active = true;

module.exports.description = 'rounds numeric values to the fixed precision, removes default ‘px’ units, and empty attributes';


