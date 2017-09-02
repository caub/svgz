const {round, parsePathData, stringifyNumbers, toRelative} = require('../util');

module.exports = function convertPathData(svg, {precision}) {

	svg.querySelectorAll('path').forEach(path => {

		const d = path.getAttribute('d');
		if (d) {
			const pathData = parsePathData(d);

			// todo process, shrink repeated, etc..


			// round (shoud test if relative/abs segments are shorter here)
			for (let i=0; i<pathData.length; i++) {
				const data = pathData[i];
				if (data.values) {
					for (let j=0; j<data.values.length; j++) {
						data.values[j] = round(data.values[j], precision);
					}
				}
			}

			path.setAttribute('d', pathData.map(seg => seg.type + stringifyNumbers(seg.values || [])).join(''));
		}
		
	});

	
}

module.exports.active = true;

module.exports.description = 'optimizes path data: writes in shorter form, applies transformations';


// convert all path to relative commands only
function toRelativePath(path) {
	toRelative
}