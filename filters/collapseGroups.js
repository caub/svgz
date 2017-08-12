const {walk} = require('../utils');
const {inheritableAttrs, elemsGroups:{animation:animationElems}} = require('./_collections');

module.exports = function moveGroupAttrsToElems(svg) {

	// walk reverse, to process children first
	walk(svg, el =>  {

		let g = el.lastElementChild;

		while (g) {
			const previous = g.previousElementSibling;

			if (g.nodeType=='g' && g.childElementCount>0) {

				if (g.attributes.length && g.childElementCount===1) {
					const child = g.firstElementChild;

					if (
						!child.hasAttribute('id') && 
						(!g.hasAttribute('class') || !child.hasAttribute('class')) &&
						(!g.hasAttribute('clip-path') && !g.hasAttribute('mask') || 
							child.nodeType==='g' && !g.hasAttribute('transform') && !child.hasAttribute('transform')) && 
						!g.querySelector(animationElems+'')
					) {

						const attrs = Array.from(g.attributes);

						attrs.forEach(a => {
							if (!child.hasAttribute(a.name)) {
								child.setAttribute(a.name, a.value);
								g.removeAttribute()
							} else if (a.name==='transform') {
								child.setAttribute('transform', transform+' '+a.value);
							} else if (!inheritableAttrs.has(a.name) && 
								(!child.hasAttribute(a.name) || child.getAttribute(a.name)!==a.value)) {
								return;
							}
							g.removeAttribute(a.name);
						});

					}
				}

				const children = Array.from(g.children);
				if (!g.attributes.length && !children.some(c => animationElems.has(c.nodeName))) {
					// const fg = document.createDocumentFragment();
					// fg.append(...children); // test if jsdom as it
					g.after(...children); // test if jsdom as it
					g.remove();
				}

			} else if (g.nodeName=='switch' && !g.childElementCount) {
				g.remove();
			}

			g = previous;
		}
		
	}, true);

}


module.exports.active = true;

module.exports.description = 'collapses useless groups';