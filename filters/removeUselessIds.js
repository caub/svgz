const {walk} = require('../utils');

// https://www.w3.org/TR/SVG/linking.html#processingIRI
const referencesAttrs = new Set([
	'clip-path',
	'color-profile',
	'fill',
	'filter',
	'marker-start',
	'marker-mid',
	'marker-end',
	'mask',
	'stroke',
	'style'
]);


module.exports = function removeUselessIds(svg) {

	if (svg.querySelector('script,style')) return;

	const ids = new Map(Array.from(svg.querySelectorAll('[id]'), x=>[x.id]));

	walk(svg, el => {

		for (var i=0; i<el.attributes.length; i++) {
			const a = el.attributes[i];
			var m;
			if (referencesAttrs.has(a.name) && a.value.includes('url(')) {
				const m = a.value.match(/\burl\((["'])?#([^"')]*)\1\)/);
				if (m && ids.has(m[2])) {
					ids.set(m[2], true);
				}
			} else if (a.name=='href' && ids.has(a.value.slice(1))) {
				ids.set(a.value.slice(1), true);
			} else if (a.name=='begin' && a.value.includes('.end')) {
				const m = a.value.match(/(?:^|;)([^;]*)\.end/);
				if (m && ids.has(m[1])) {
					ids.set(m[1], true);
				}
			}
		}
	});

	ids.forEach((exists, id) => {
		if (!exists) {
			svg.querySelectorAll('#'+id).forEach(el => {
				el.removeAttribute('id');
			});
		}
	});
}


module.exports.active = true;

module.exports.description = 'removes useless id attributes';