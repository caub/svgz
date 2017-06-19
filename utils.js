
exports.removeLeadingZero = s => s.replace(/\b0(?=\.\d)/g, '');
/*
example:
console.log(exports.removeLeadingZero('0.99 10.2 -0.5'));
*/


exports.round = function round(value, precisionPow10) {
    var rounded = Math.round(value*precisionPow10)/precisionPow10,
        pMore = Math.max(precisionPow10/10, 1),
        roundedMore = Math.round(value * pMore) /  pMore;
    return Math.round(10*precisionPow10*Math.abs(roundedMore - value)) > 10 ? rounded : roundedMore;
}
/*
example:
console.log(exports.round(-0.24580, 1e2))
*/


const entities = {
	'"': "'",
	'>': '&gt;',
	'<': '&lt;'
};
const entitiesRe = /["<>]/g;

function encodeEntity(char) {
	return entities[char];
}


// stringify an element
exports.stringify = function stringify(el, indent='') {
	const EOL = indent ? '\n' : '', tag = el.tagName.toLowerCase();
	return [`<${tag}${stringifyAttr(el)}>`,
			...stringifyChildren(el, indent).map(l => indent + l),
	`</${tag}>`].join(EOL)
}

// recursively stringify elements children, returns an array of lines
function stringifyChildren(el, indent='') { 
	const lines = [];
	for (const c of el.children) {
		const tag = c.tagName.toLowerCase();
		if (!c.childElementCount) {
			lines.push(c.textContent ? `<${tag}${stringifyAttr(c)}>${c.textContent}</${tag}>` : `<${tag}${stringifyAttr(c)}/>`);
		} else {
			lines.push(
				`<${tag}${stringifyAttr(c)}>`,
				...stringifyChildren(c, indent).map(l => indent + l),
				`</${tag}>`
			);
		}
	}
	return lines;
}

const stringifyAttr = el => (el.attributes.length?' ':'')+Array.from(el.attributes, a => `${a.name}${a.value ? `="${a.value.replace(entitiesRe, encodeEntity)}"` : ''}`).join(' ');

