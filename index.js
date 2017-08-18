const PLUGINS = require('./plugins/');
const {stringify, parse} = require('./utils');

// doctype and XML processing instruction are ignored since one svg element is processed and returned
// comments and any non element are also ignored, see utils#stringify

/*
Main function
args:
 - svgStr (svg string or svg Element)
 - optional configs in this format:
{
	decimals: 2, // or precision: 1e2, it's converted in this pow10 format to be used in utils#round
	iterations: 3 // max number of iterations, until svg size decreases
	indent: '' // by default, for minifying, if you put any non-empty string, it will add line returns and indent with it
	plugins: {
		pluginName: {param1: param1Value, param2: param2Value},
		otherPluginName: false // (if false, this plugin will be disabled)
	} 
}

returns optimized svgString

*/
module.exports = function(svgStr, {decimals, precision=Math.pow(10, decimals||3), indent='', iterations=5, plugins={}}={}) {

	const svg = typeof svgStr==='string' || svgStr instanceof Buffer ? parse(svgStr.toString()) : svgStr;

	for (const name in PLUGINS) {
		const plugin = PLUGINS[name];
		const pluginOpts = plugins[name];

		if (plugin.active && pluginOpts!==false && pluginOpts!==null) {
			plugin(svg, Object.assign({precision}, pluginOpts||{}));
		}
	}

	return stringify(svg, indent);
}