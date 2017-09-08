const {parsePathData, toAbsolute, stringifyPath} = require('../util');

module.exports = function convertPathData(svg, {
	precision, 
	transformPrecision = 1e5,
	makeArc: {
		threshold=2.5, // coefficient of rounding error
		tolerance=.5 // percentage of radius
	} = {}
}) {

	svg.querySelectorAll('path').forEach(path => {

		const d = path.getAttribute('d');
		if (d) {
			const pathData = parsePathData(d);

			// todo applyTransforms (see Readme#todos)

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