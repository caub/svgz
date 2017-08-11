const {removeLeadingZero, round, walk} = require('../utils');
const svgPath = require('svg-path');

const numRe = /\b([\-+]?\d*\.?\d+(?:[eE][\-+]?\d+)?)\b/g;
const numPxRe = /\b([\-+]?\d*\.?\d+(?:[eE][\-+]?\d+)?)(?:px)?\b/g;

module.exports = function cleanupNumericValues(svg, {precision}) {

	for (var i=0; i<svg.attributes.length; i++) {
		const a = svg.attributes[i];
		svg.setAttribute(a.name, roundValues(a.value, a.name=='transform'?precision*precision:precision, a.name=='style'?numRe:numPxRe));// a.value =  //works too
	}

	walk(svg, el => {
		for (var i=0; i<el.attributes.length; i++) {
			const a = el.attributes[i];
			if (a.value) {
				if (a.name=='d') { // check also el.tagName=='path'?
					const path = svgPath(a.value);
					path.content.forEach(o => {
						for (const k in o) {
							if (typeof o[k]=='number') {
								o[k] = round(o[k], precision); // Math.round(o[k]*precision)/precision; //
							}
						}
					});
					el.setAttribute(a.name, path+'');
				} else {
					el.setAttribute(a.name, roundValues(a.value, a.name=='transform'?precision*precision:precision, a.name=='style'?numRe:numPxRe));
				}
			}
		}
	});
}

// don't round transform here? will be done sep? it's rounded with 6 dec by default, should be safe

const roundValues = (str, precision, re) => str.replace(re, (_,x) => removeLeadingZero(round(x, precision)+''));


module.exports.active = true;

module.exports.description = 'rounds numeric values to the fixed precision, removes default ‘px’ units';


/*
example x="10.000001" -> x="10"


var v = "11.042819316255512 545.6129991817525px 3.884523422467454e2 35.348893970883296";
console.log(v.replace(numPxRe, (_,x) => Math.round(x*10)/10))

*/

