
// require jsdom only on nodejs (avoid bundling it for browser)
const {JSDOM} = typeof window=='undefined' ? require('jsdom') : {};

exports.parse = JSDOM ? 
	svgStr => new JSDOM(svgStr).window.document.querySelector('svg') :
	svgStr => document.createRange().createContextualFragment(svgStr).querySelector('svg');



function removeLeadingZero(n) {
	if (0 < n && n < 1)	return (n+'').slice(1);
	if (-1 < n && n < 0) return '-'+(n+'').slice(2);
	return n;
}
exports.removeLeadingZero = removeLeadingZero;

// const stripZero = s => s.replace(/\b0(?=\.\d)/g, ''); // not to be used in path data!



function round(value, precisionPow10) {
	var rounded = Math.round(value*precisionPow10)/precisionPow10,
		pMore = Math.max(precisionPow10/10, 1),
		roundedMore = Math.round(value * pMore) /  pMore;
	return Math.round(10*precisionPow10*Math.abs(roundedMore - value)) > 10 ? rounded : roundedMore;
}
exports.round = round;
/*
example:
console.log(exports.round(-0.24580, 1e2))
*/

const numRe = /\b([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)\b/g; // beware, this guy leaves the - apart

exports.roundStringValues = (str, precision, re=numRe) => str.replace(re, (_,x) => removeLeadingZero(round(x, precision)));


// function toExponential(x) { // like x.toExponential().replace(/e\+/, 'e')
// 	let n = Math.abs(x);
// 	if (n===0) return 0;
// 	const p = Math.floor(Math.log10(n));
// 	if (p>0) n = n / (10**p);
// 	else if (p<0) n = n * (10**-p);
// 	return (x<0 ? '-' : '')+ n + 'e' + p;
// }

exports.stringifyNumbers = numbers => {
	if (!numbers.length) return '';

	const first = numbers[0];
	let result = first > -1 && first < 0 ? (first+'').slice(2) :
		first > 0 && first < 1 ? (first+'').slice(1) :
		first + '';

	let seenFloat = !Number.isInteger(first);
	// let seenExponent = false;

	for (let i = 1; i < numbers.length; i++) {
		const x = numbers[i];
		if (x < 0) {
			if (x > -1) {
				result += '-' + (x+'').slice(2);
				seenFloat = true;
			} else {
				result += x;
				seenFloat = !Number.isInteger(x);
			}
		} else {
			if (x > 0 && x < 1) {
				if (!seenFloat) {
					result += ','
				}
				result += (x+'').slice(1);
				seenFloat = true;
			} else {
				result += ',' + x;
				seenFloat = !Number.isInteger(x);
			}
		}
	}
	return result;
};



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

function walk(node, cb, reverse) {
	if (!reverse) cb(node);
	var child = node.firstElementChild;
	while(child) {
		walk(child, cb, reverse);
		child = child.nextElementSibling;
	}
	if (reverse) cb(node);
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


// Decompose matrix into simple transforms
exports.matrixToTransform = function matrixToTransform(tf, precision, tfPrecision) {
	var data = tf.data,
		tfs = [],
		sx = Math.round(Math.sqrt(data[0] * data[0] + data[1] * data[1])*tfPrecision)/tfPrecision,
		sy = Math.round((data[0] * data[3] - data[1] * data[2]) / sx * tfPrecision)/tfPrecision,
		colsSum = data[0] * data[2] + data[1] * data[3],
		rowsSum = data[0] * data[1] + data[2] * data[3],
		scaleBefore = rowsSum || +(sx == sy);

	// [..., ..., ..., ..., tx, ty] → translate(tx, ty)
	if (data[4] || data[5]) {
		tfs.push({ name: 'translate', data: data.slice(4, data[5] ? 6 : 5) });
	}

	// [sx, 0, tan(a)·sy, sy, 0, 0] → skewX(a)·scale(sx, sy)
	if (!data[1] && data[2]) {
		tfs.push({ name: 'skewX', data: [Math.round(Math.atan(data[2]/sy)*180/Math.PI*precision)/precision] });

	// [sx, sx·tan(a), 0, sy, 0, 0] → skewY(a)·scale(sx, sy)
	} else if (data[1] && !data[2]) {
		tfs.push({ name: 'skewY', data: [Math.round(Math.atan(data[1]/data[0])*180/Math.PI*precision)/precision] });
		sx = data[0];
		sy = data[3];

	// [sx·cos(a), sx·sin(a), sy·-sin(a), sy·cos(a), x, y] → rotate(a[, cx, cy])·(scale or skewX) or
	// [sx·cos(a), sy·sin(a), sx·-sin(a), sy·cos(a), x, y] → scale(sx, sy)·rotate(a[, cx, cy]) (if !scaleBefore)
	} else if (!colsSum || (sx == 1 && sy == 1) || !scaleBefore) {
		if (!scaleBefore) {
			sx = (data[0] < 0 ? -1 : 1) * Math.sqrt(data[0] * data[0] + data[2] * data[2]);
			sy = (data[3] < 0 ? -1 : 1) * Math.sqrt(data[1] * data[1] + data[3] * data[3]);
			tfs.push({ name: 'scale', data: sx == sy ? [sx] : [sx, sy] });
		}
		var rotate = [Math.round(Math.acos(data[0]/sx)*180/Math.PI*precision)/precision * (data[1] * sy < 0 ? -1 : 1)];

		if (rotate[0]) tfs.push({ name: 'rotate', data: rotate });

		if (rowsSum && colsSum) tfs.push({
			name: 'skewX',
			data: [Math.round(Math.atan(colsSum/(sx*sx))*180/Math.PI*precision)/precision]
		});

		// rotate(a, cx, cy) can consume translate() within optional arguments cx, cy (rotation point)
		if (rotate[0] && (data[4] || data[5])) {
			tfs.shift();
			var cos = data[0] / sx,
				sin = data[1] / (scaleBefore ? sx : sy),
				x = data[4] * (scaleBefore || sy),
				y = data[5] * (scaleBefore || sx),
				denom = ((1-cos)*(1-cos) + sin*sin) * (scaleBefore || sx * sy);
			rotate.push(((1 - cos) * x - sin * y) / denom);
			rotate.push(((1 - cos) * y + sin * x) / denom);
		}

	// Too many transformations, return original matrix if it isn't just a scale/translate
	} else if (data[1] || data[2]) {
		return [tf];
	}

	if (scaleBefore && (sx != 1 || sy != 1) || !tfs.length) tfs.push({
		name: 'scale',
		data: sx == sy ? [sx] : [sx, sy]
	});

	return tfs;
}




// Multiply transforms into one.

exports.transformsMultiply = function(tfs) {

	// convert transforms objects to the matrices
	const datas = tfs.map(tf => tf.name === 'matrix' ? tf.data : transformToMatrix(tf));

	// multiply all matrices into one
	return {
		name: 'matrix',
		data: datas.reduce(multiplyTransformMatrices)
	};
};


function transformToMatrix(tf) {

	if (tf.name === 'matrix') return tf.data;

	switch (tf.name) {
		case 'translate': // [1, 0, 0, 1, tx, ty]
			return  [1, 0, 0, 1, tf.data[0], tf.data[1] || 0];

		case 'scale': // [sx, 0, 0, sy, 0, 0]
			return [tf.data[0], 0, 0, tf.data[1] || tf.data[0], 0, 0];

		case 'rotate': // [cos(a), sin(a), -sin(a), cos(a), x, y]
			var cos = Math.cos(tf.data[0]*Math.PI/180),
				sin = Math.sin(tf.data[0]*Math.PI/180),
				cx = tf.data[1] || 0,
				cy = tf.data[2] || 0;

			return [cos, sin, -sin, cos, (1 - cos) * cx + sin * cy, (1 - cos) * cy - sin * cx];

		case 'skewX': // [1, 0, tan(a), 1, 0, 0]
			return [1, 0, Math.tan(tf.data[0]*Math.PI/180), 1, 0, 0];

		case 'skewY': // [1, tan(a), 0, 1, 0, 0]
			return [1, Math.tan(tf.data[0]*Math.PI/180), 0, 1, 0, 0];
	}
}

function multiplyTransformMatrices(a, b) {
	return [
		a[0] * b[0] + a[2] * b[1],
		a[1] * b[0] + a[3] * b[1],
		a[0] * b[2] + a[2] * b[3],
		a[1] * b[2] + a[3] * b[3],
		a[0] * b[4] + a[2] * b[5] + a[4],
		a[1] * b[4] + a[3] * b[5] + a[5]
	];
}
