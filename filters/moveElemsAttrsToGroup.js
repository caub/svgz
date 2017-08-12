const {walk} = require('../utils');
const {inheritableAttrs} = require('./_collections');

const inheritAttrs = new Set(inheritableAttrs);
inheritAttrs.delete('transform'); // except transform


module.exports = function moveElemsAttrsToGroup(svg) {

	// walk reverse, to process children first
	walk(svg, el =>  {

		if (el.nodeName=='g' && el.childElementCount>0) { // svgo does >1 but let's try to put up higher (todo tests)
			const map = new Map(); // attr name => [attrs values]

			for (var i=0; i<el.childElementCount; i++) {
				const c = el.children[i];
				for (var j=0; j<c.attributes.length; j++) {
					const a = c.attributes[j];
					if (inheritAttrs.has(a.name)) {
						map.set(a.name+' '+a.value, (map.get(a.name+' '+a.value)||0)+1);
					}
				}
			}

			// move up attrs when the same are present in all children
			map.forEach((count, key) => {
				if (count==el.childElementCount) {
					const i = key.indexOf(' '), name = key.slice(0, i), value = key.slice(i+1);
					let child = el.firstElementChild;
					while(child) {
						child.removeAttribute(name);
						child = child.nextElementSibling;
					}
					el.setAttribute(name, value);
				}
			});
		}

	}, true);
}


module.exports.active = true;

module.exports.description = 'moves elements attributes to the existing group wrapper, except transform';
