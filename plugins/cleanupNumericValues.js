const {round, roundStringValues, walk} = require('../utils');
const svgPath = require('svg-path');

const numRe = /\b([\-+]?\d*\.?\d+(?:[eE][\-+]?\d+)?)\b/g;
const numPxRe = /\b([\-+]?\d*\.?\d+(?:[eE][\-+]?\d+)?)(?:px)?\b/g;

module.exports = function cleanupNumericValues(svg, {precision}) {

	for (var i=0; i<svg.attributes.length; i++) {
		const a = svg.attributes[i];
		svg.setAttribute(a.name, roundStringValues(a.value, precision, a.name==='style'?numRe:numPxRe));// a.value =  //works too
	}

	walk(svg, el => {
		for (var i=0; i<el.attributes.length; i++) {
			const a = el.attributes[i];
			if (a.value) {
				if (a.name=='d') { // check also el.tagName=='path'? // TODO process pathdata apart (minify will be there)
					const path = svgPath(a.value);
					path.content.forEach(o => {
						for (const k in o) {
							if (typeof o[k]==='number') {
								o[k] = round(o[k], precision); // Math.round(o[k]*precision)/precision; //
							}
						}
					});
					el.setAttribute(a.name, path+'');
				} else if (a.name!=='transform') { // already treated in convertTransform
					el.setAttribute(a.name, roundStringValues(a.value, precision, a.name==='style'?numRe:numPxRe));
				}
			}
		}
	});
}


module.exports.active = true;

module.exports.description = 'rounds numeric values to the fixed precision, removes default ‘px’ units';


