const {round, roundStringValues, walk, stringifyNumbers} = require('../utils');
const {parsePathData} = require('path-data-polyfill/polyfill');

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
					const pathData = parsePathData(a.value);
					const segs = pathData.map(seg => seg.type + stringifyNumbers((seg.values || []).map(x => round(x, precision))));

					el.setAttribute(a.name, segs.join(''));
				} else if (a.name!=='transform') { // already treated in convertTransform
					el.setAttribute(a.name, roundStringValues(a.value, precision, a.name==='style'?numRe:numPxRe));
				}
			}
		}
	});
}


module.exports.active = true;

module.exports.description = 'rounds numeric values to the fixed precision, removes default ‘px’ units';


