
const {parseNumbers, round} = require('./numbers');

const segLengths = {h:1, v:1, b:1, m:2, l:2, t:2, q:4, s:4, c:6, a:7};

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




function toRelativePath(path) {
	
}

// convert points data to relative coordinates
// previous x,y coords, if any, are stored hackily in data[-1] and data[-2]
function toRelative(data) {
	const newData = Array(data.length);
	for (var i = 0; i < data.length; i+=2) {
		newData[i] = data[i] - (data[i-2] || 0);
		newData[i+1] = data[i+1] - (data[i-1] || 0);
	}
	newData[-2] = data[data.length-2];
	newData[-1] = data[data.length-1];
	return newData;
}

exports.toRelative = toRelative;

// convert points data to relative coordinates, and round
// previous x,y coords, if any, are stored hackily in data[-1] and data[-2]
exports.toRelativeRound = function (data, precision) {
	const newData = Array(data.length);
	var ex=0, ey = 0; // cumulative rounding error, it should not exceed [-error/2, error/2] 
	for (var i = 0; i < data.length; i+=2) {
		const dx = round(data[i] - (data[i-2] || 0) + ex, precision);
		const dy = round(data[i+1] - (data[i-1] || 0) + ey, precision);
		newData[i] = dx;
		newData[i+1] = dy;
		ex = data[i] - (data[i-2] || 0) + ex - dx;
		ey = data[i+1] - (data[i-1] || 0) + ey - dy;
	}
	newData[-2] = data[data.length-2];
	newData[-1] = data[data.length-1];
	return newData;
}

// convert points data to absolute coordinates
// previous (absolute) x,y coords, if any, are stored hackily in data[-1] and data[-2]
exports.toAbsolute = function (data) {
	const newData = Array(data.length);
	for (var i = 0; i < data.length; i+=2) {
		newData[i] = data[i] + (newData[i-2] || data[i-2] || 0);
		newData[i+1] = data[i+1] + (newData[i-1] || data[i-1] || 0);
	}
	return newData;
}
