
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

