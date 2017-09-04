
const {parseNumbers, stringifyNumbers, round} = require('./numbers');

const segLengths = {h:1, v:1, b:1, m:2, l:2, t:2, q:4, s:4, c:6, a:7};

// parse and 'normalize'
exports.parsePathData = function(s) {
	const parts = s.split(/([mlhvcsqtarbz])\s*/i);
	// parts[0] and parts[parts.length-1] are wsp
	if (parts[1][0] !== 'm' && parts[1][0] !== 'M') return [];

	const data = [];

	for (var i=1; i<parts.length-1; i+=2) {
		const type = parts[i][0],
			_type = type.toLowerCase();

		if (_type==='z') {
			data.push({type: _type});
		} else {
			const values = parseNumbers(parts[i+1]);
			const vlen = segLengths[_type] || Math.floor(values.length/2)*2; // treat rR

			const len = Math.floor(values.length/vlen)*vlen;
			// handle repeated values and skip remaining: l10,10 20,15 25 -> l10,10l20,15
			for (var j=0; j<len; j+=vlen) {
				data.push({
					type: j===0 ? type : type==='m' ? 'l' : type==='M' ? 'M' : type,
					values: values.slice(j, j+vlen)
				})
			}
		}
	}
	return data;
};



// convert to only relative path types (mutates), add X and Y to each segment (not necessary, but useful)
exports.toRelative = function (path) {
	let X=0, Y=0, subX=0, subY=0;

	for (let i=0; i<path.length; i++) {
		const seg = path[i], 
			values = seg.values,
			type = seg.type,
			_type = seg.type.toLowerCase();

		if (type === 'h') {
			X += values[0];
		}
		else if (type === 'v') {
			Y += values[0];
		}
		else if (_type === type && values.length > 1) { // > 1 to skip b
			const r = _type === 'r' ? 2 : 0;
			X += values[values.length-2-r];
			Y += values[values.length-1-r];
			if (_type === 'm') {
				subX = X;
				subY = Y;
			}
		}
		else if (type === 'H') {
			values[0] -= X;
			X += values[0];
		}
		else if (type === 'V') {
			values[0] -= Y;
			Y += values[0];
		}
		else if (type === 'A') {
			values[5] -= X;
			values[6] -= Y;
			X += values[5];
			Y += values[6];
		}
		else if (values && values.length>1) { // > 1 to skip b
			for (let j=0; j<values.length; j+=2) {
				values[j] -= X;
				values[j+1] -= Y;
			}
			const r = _type === 'r' ? 2 : 0;
			X += values[values.length-2-r];
			Y += values[values.length-1-r];
			if (_type === 'm') {
				subX = X;
				subY = Y;
			}
		}

		seg.type = _type;
		seg.X = X;
		seg.Y = Y;

		if (_type === 'z') {
			X = subX;
			Y = subY;
		}
	}
}

exports.toAbsolute = function (path) {
	let X=0, Y=0, subX=0, subY=0;

	for (let i=0; i<path.length; i++) {
		const seg = path[i], 
			values = seg.values,
			type = seg.type,
			_type = seg.type.toUpperCase();

		if (type === 'H') {
			X = values[0];
		}
		else if (type === 'V') {
			Y = values[0];
		}
		else if (_type === type && values.length > 1) { // > 1 to skip B
			const r = _type === 'R' ? 2 : 0;
			X = values[values.length-2-r];
			Y = values[values.length-1-r];
			if (_type === 'M') {
				subX = X;
				subY = Y;
			}
		}
		if (type === 'h') {
			values[0] += X;
			X = values[0];
		}
		else if (type === 'v') {
			values[0] += Y;
			Y = values[0];
		}
		else if (type === 'a') {
			values[5] += X;
			values[6] += Y;
			X = values[5];
			Y = values[6];
		}
		else if (values && values.length>1) { // > 1 to skip B
			for (let j=0; j<values.length; j+=2) {
				values[j] += X;
				values[j+1] += Y;
			}
			const r = _type === 'R' ? 2 : 0;
			X = values[values.length-2-r];
			Y = values[values.length-1-r];
			if (_type === 'M') {
				subX = X;
				subY = Y;
			}
		}

		seg.type = _type;
		seg.X = X;
		seg.Y = Y;

		if (_type === 'Z') {
			X = subX;
			Y = subY;
		}
	}
}

// expects an absolute path in arg
// stringify after rounding and choosing shortest between absolute and relative segment
exports.stringifyPath = function (path, precision) {
	let s = ''; // build string, and compare s + relSeg vs s + absSeg to take shortest

	let X=0, Y=0; // X Y previous absolute positions, (with rounding)

	for (let i=0; i<path.length; i++) {
		const seg = path[i], 
			values = seg.values,
			type = seg.type;

		// construct rel and abs for all types
		const rel = {}, abs = {};

		if (type === 'H') {
			const h = round(values[0] - X, precision), s_h = stringifyNumbers([h]);
			const H = round(values[0], precision), s_H = stringifyNumbers([H]);
			
			if (s_h.length < s_H.length) {
				s += 'h' + s_h;
				X += h;
			} else {
				s += 'H' + s_H;
				X = H;
			}
		}
		else if (type === 'V') {
			const v = round(values[0] - Y, precision), s_v = stringifyNumbers([v]);
			const V = round(values[0], precision), s_V = stringifyNumbers([V]);
			
			if (s_v.length < s_V.length) {
				s += 'v' + s_v;
				Y += v;
			} else {
				s += 'V' + s_V;
				Y = V;
			}
		}
		else if (type === 'A') {
			const SEG = values.map(x => round(x, precision)), 
				s_SEG = stringifyNumbers(SEG);
			const seg = SEG.slice(0,5).concat(round(values[5] - X, precision), round(values[6] - Y, precision));
				s_seg = stringifyNumbers(seg);
			
			if (s_seg.length < s_SEG.length) {
				s += 'a' + s_seg;
				X += seg[5];
				Y += seg[6];
			} else {
				s += 'A' + s_SEG;
				X = SEG[5];
				Y = SEG[6];
			}
		}
		else if (values && values.length>1) { // > 1 to skip b
			const VALS = values.map(x => round(x, precision)), 
				s_VALS = stringifyNumbers(VALS);

			const vals = Array(values.length);
			for (let j=0; j<values.length; j+=2) {
				vals[i] = round(values[i] - X, precision);
				vals[i+1] = round(values[i+1] - Y, precision);
			}
			const s_vals = stringifyNumbers(vals);

			const r = type === 'R' ? 2 : 0;

			if (s_vals.length < s_VALS.length) {
				s += type.toLowerCase() + s_vals;
				X += vals[vals.length - 2 - r];
				Y += vals[vals.length - 1 - r];
			} else {
				s += type + s_VALS;
				X = VALS[VALS.length - 2 -r];
				Y = VALS[VALS.length - 1 -r];
			}
			
		} else if (type === 'B') {
			s += 'B' + round(values[0], precision);
		} else if (type === 'Z') {
			s += 'Z';
		}

	}
	return s;
}
