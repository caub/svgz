const {removeLeadingZero, round} = require('../utils');

const numRe = /\b([\-+]?\d*\.?\d+(?:[eE][\-+]?\d+)?)\b/g;
const numPxRe = /\b([\-+]?\d*\.?\d+(?:[eE][\-+]?\d+)?)(?:px)?\b/g;

module.exports = function cleanupNumericValues(svg, opts, {precision}) {

	for (var i=0; i<svg.attributes.length; i++) {
		const a = svg.attributes[i];
		svg.setAttribute(a.name, roundValues(a.value, a.name=='transform'?precision*precision:precision, a.name=='style'?numRe:numPxRe));// a.value =  //works too
	}
	svg.querySelectorAll('*').forEach(el => {
		for (var i=0; i<el.attributes.length; i++) {
			const a = el.attributes[i];
			if (a.value) {
				el.setAttribute(a.name, roundValues(a.value, a.name=='transform'?precision*precision:precision, a.name=='style'?numRe:numPxRe));
			}
		}
	});
}

const roundValues = (str, precision, re) => str.replace(re, (_,x) => removeLeadingZero(round(x, precision)+''));


module.exports.active = true;

module.exports.description = 'rounds numeric values to the fixed precision, removes default ‘px’ units';


/*
example x="10.000001" -> x="10"


var v = "11.042819316255512 545.6129991817525px 3.884523422467454e2 35.348893970883296";
console.log(v.replace(numPxRe, (_,x) => Math.round(x*10)/10))

*/

