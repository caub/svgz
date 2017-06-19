
const filters = require('./filters.json');
const {JSDOM} = require('jsdom');
const {stringify} = require('./utils');

// doctype and XML processing instruction are ignored since one svg element is processed and returned
// comments and any non element are also ignored, see utils#stringify

/*
Main function
args:
 - svgStr (svg string or svg element (jsdom))
 - optional global config in this format:
{
	decimals: 2, // or precision: 1e2, it's converted in this pow10 format to be used in utils#round
	iterations: 3 // max number of iterations, until svg size decreases
	indent: '' // by default, for minifying, if you put any non-empty string, it will add line returns and indent with it
}
 - optional filters object in this format
{
	filterName: {param1: paramValue},
	otherFilter: otherOpts
}

returns optimized svgString

*/
module.exports = function(svgStr, {decimals, precision=Math.pow(10, decimals||2), indent='', iterations=5}={}, filtersParams={}) {

	const svg = typeof svgStr=='string' ? new JSDOM(svgStr).window.document.querySelector('svg') : svgStr;

	const cfg = {precision};

	filters.forEach(filterName => {
		const filter = require('./filters/'+filterName);
		if (filter.active) {
			filter(svg, filtersParams[filterName], cfg);
		}
	});

	return stringify(svg, indent);
}