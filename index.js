const plugins = require('./plugins/');
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
 - optional plugins object in this format name => opts (if opts is false, this module is disabled)
{
	pluginName: {param1: paramValue},
	otherPlugin: otherOpts
}

returns optimized svgString

*/
module.exports = function(svgStr, {decimals, precision=Math.pow(10, decimals||3), indent='', iterations=5}={}, pluginsParams={}) {

	const svg = typeof svgStr==='string' || svgStr instanceof Buffer ? parse(svgStr.toString()) : svgStr;

	const cfg = {precision};

	for (const name in plugins) {
		const plugin = plugins[name];
		const pluginOpts = pluginsParams[name];

		if (plugin.active && pluginOpts!==false && pluginOpts!==null) {
			plugin(svg, cfg, pluginOpts||{});
		}
	}

	return stringify(svg, indent);
}