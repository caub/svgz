Object.assign(module.exports, require('./collections'));
Object.assign(module.exports, require('./numbers'));
Object.assign(module.exports, require('./path'));
Object.assign(module.exports, require('./transform'));

// require jsdom only on nodejs (avoid bundling it for browser)
const {JSDOM} = typeof window==='undefined' ? require('jsdom') : {};

exports.parse = JSDOM ? 
	svgStr => new JSDOM(svgStr).window.document.querySelector('svg') :
	svgStr => document.createRange().createContextualFragment(svgStr).querySelector('svg');


const entities = {
	'"': "'"
	// '>': '&gt;',
	// '<': '&lt;'
};
const entitiesRe = /["]/g;  // /["<>]/g;

function encodeEntity(char) {
	return entities[char];
}


// stringify an element
exports.stringify = function stringify(el, indent='') {
	const EOL = indent ? '\n' : '';

	return [`<${el.tagName}${stringifyAttr(el)}>`,
			...stringifyChildren(el, indent).map(l => indent + l),
	`</${el.tagName}>`].join(EOL)
}

// recursively stringify elements children, returns an array of lines
function stringifyChildren(el, indent='') { 
	const lines = [];
	for (const c of el.children) {
		if (!c.childElementCount) {
			lines.push(c.textContent ? `<${c.tagName}${stringifyAttr(c)}>${c.textContent}</${c.tagName}>` : `<${c.tagName}${stringifyAttr(c)}/>`);
		} else {
			lines.push(
				`<${c.tagName}${stringifyAttr(c)}>`,
				...stringifyChildren(c, indent).map(l => indent + l),
				`</${c.tagName}>`
			);
		}
	}
	return lines;
}

const stringifyAttr = el => (el.attributes.length?' ':'')+Array.from(el.attributes, a => `${a.name}="${a.value.replace(entitiesRe, encodeEntity)}"`).join(' ');


exports.walk = walk;

function walk(node, cb) {
	cb(node);
	let child = node.firstElementChild;
	while(child) {
		walk(child, cb);
		child = child.nextElementSibling;
	}
}

exports.walkReverse = walkReverse;

function walkReverse(node, cb) {
	let child = node.firstElementChild;
	while(child) {
		walkReverse(child, cb);
		child = child.nextElementSibling;
	}
	cb(node);
}

// not used (yet)
exports.getWidthHeightUnit = function getWidthHeightUnit(svg) {
	if(svg.getAttribute('viewBox')) { // try to use viewBox
		const [,,w,h] = svg.getAttribute('viewBox').split(/[ ,]/).map(parseFloat);
		return {width:w, height:h};
	}

	const width = svg.getAttribute('width'), 
		height = svg.getAttribute('height');

	if (width && height) {
		const unit = width.match(/[a-z]+$/);
		return {width: parseFloat(width), height: parseFloat(height), unit: unit?unit[0]:undefined}
	}
	return {};
}

