const filters = require('./filters.json');
const {stringify, parse} = require('./utils');

// doctype and XML processing instruction are ignored since one svg element is processed and returned
// comments and any non element are also ignored, see utils#stringify

/*
Main function
args:
 - svgStr (svg string or svg Element)
 - optional global config in this format:
{
	decimals: 2, // or precision: 1e2, it's converted in this pow10 format to be used in utils#round
	iterations: 3 // max number of iterations, until svg size decreases
	indent: '' // by default, for minifying, if you put any non-empty string, it will add line returns and indent with it
}
 - optional filters object in this format name => opts (if opts is false, this module is disabled)
{
	filterName: {param1: paramValue},
	otherFilter: otherOpts
}

returns optimized svgString

*/
module.exports = function(svgStr, {decimals, precision=Math.pow(10, decimals||3), indent='', iterations=5}={}, filtersParams={}) {

	const svg = typeof svgStr==='string' || svgStr instanceof Buffer ? parse(svgStr.toString()) : svgStr;

	const cfg = {precision};

	filters.forEach(filterName => {
		const filter = require('./filters/'+filterName);
		const opts = filtersParams[filterName];
		if (filter.active && opts!==false || opts && typeof opts=='object') {
			filter(svg, filtersParams[filterName], cfg);
		}
	});

	return stringify(svg, indent);
}