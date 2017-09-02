const {walk, referencesAttrs} = require('../util');

const pathElemsRe = /^(g|text|path|glyph|missing-glyph)$/;

module.exports = function moveGroupAttrsToElems(svg) {

	walk(svg, el =>  {

		if (
			el.nodeName=='g' &&
			el.hasAttribute('transform') &&
			el.childElementCount
		) {
			const attrs = Array.from(el.attributes), children = Array.from(el.children);
			if (
				!attrs.some(a => referencesAttrs.has(a.name) && e.value.includes('url(')) && 
				children.every(c => pathElemsRe.test(c.nodeName) && !c.hasAttribute('id'))
			) {

				const transform = el.getAttribute('transform');
				children.forEach(c => {

					c.setAttribute('transform', transform+ (c.hasAttribute('transform') ? ' '+c.getAttribute('transform') : ''));

				});

				el.removeAttribute('transform');

			}
		}

	});

}


module.exports.active = true;

module.exports.description = 'moves some group attributes to the content elements';