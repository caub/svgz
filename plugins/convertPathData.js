const {parsePathData, toAbsolute, stringifyPath} = require('../util');

module.exports = function convertPathData(svg, {precision}) {

	svg.querySelectorAll('path').forEach(path => {

		const d = path.getAttribute('d');
		if (d) {
			const pathData = parsePathData(d);

			// todo process, shrink repeated, etc..

			toAbsolute(pathData);

			path.setAttribute('d', stringifyPath(pathData));
		}
		
	});

	
}

module.exports.active = true;

module.exports.description = 'optimizes path data: writes in shorter form, applies transformations';


// convert all path to relative commands only
function toRelativePath(path) {
	toRelative
}