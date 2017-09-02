const {round, removeLeadingZero, matrixToTransform, transformsMultiply, parseNumbers} = require('../util');
const transformTypes = ['transform', 'gradientTransform', 'patternTransform'];

module.exports = function convertTransform(svg, {precision, transformPrecision=1e5}) {
	
	svg.querySelectorAll(transformTypes.map(t => `[${t}]`)).forEach(el => {

		transformTypes.forEach(type => {
			if (el.hasAttribute(type)) {
				const tfs = convert(parseTranform(el.getAttribute(type)), precision, transformPrecision);
				if (tfs.length) {
					el.setAttribute(type, stringifyTransform(tfs, precision, transformPrecision));
				} else {
					el.removeAttribute(type);
				}
			}
		});
		
	});

}


module.exports.active = true;

module.exports.description = 'collapses multiple transformations and optimizes it';

// shrink tranforms to 1
function convert(tfs, precision, tfPrecision) {

	const tf = tfs.length>1 ? transformsMultiply(tfs) : tfs[0];

	const decomposed = matrixToTransform(tf);

	const tfs2 = stringifyTransform(decomposed, precision, tfPrecision).length<=stringifyTransform([tf], precision, tfPrecision).length ? decomposed : [tf];

	return removeUseless(tfs2, precision);
}

const transformSplitRe = /\s*(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^)]+)\)[\s,]*/
function parseTranform(transformStr) {
	const arr = transformStr.split(transformSplitRe); // looks like ['', 'translate', '15 3', '', 'rotate', '54', '']
	return Array.from({length: (arr.length-1)/3}, (_,i) => ({name: arr[3*i+1], data: parseNumbers(arr[3*i+2])}));
}

// console.log(parseTranform(`,, translate(15, 3) ,,, translate(13) rotate(47   -39.885486 39.782373) , `))


function removeUseless(tfs, precision) {
	return tfs.filter(tf => {

		const data = tf.data.map(x => Math.round(x*precision)/precision);

		return !(
			
			// translate(0), rotate(0[, cx, cy]), skewX(0), skewY(0)
			['translate', 'rotate', 'skewX', 'skewY'].includes(tf.name) && (data.length===1 || tf.name==='rotate') && data[0]==0  ||

			// translate(0, 0)
			tf.name==='translate' && data[0]==0 && data[1]==0 ||

			// scale(1)
			tf.name==='scale' && data[0]==1 && (data.length===1 || data[1]==1) ||

			// matrix(1 0 0 1 0 0)
			tf.name==='matrix' && data[0]==1 && data[3]==1 && data[1]==0 && data[2]==0 && data[4]==0 && data[5]==0
		)
	});
}


function stringifyTransform(tfs, precision, tfPrecision) {
	return tfs.map(tf => roundTransform(tf, precision, tfPrecision)).join(' ');
}

function roundTransform(tf, precision, transformPrecision) {
	switch(tf.name) {
		case 'translate':
		case 'rotate':
		case 'skewX':
		case 'skewY':
			return `${tf.name}(${tf.data.map(x => removeLeadingZero(round(x, precision))).join(' ')})`;

		case 'scale':
			return `${tf.name}(${tf.data.map(x => removeLeadingZero(round(x, transformPrecision))).join(' ')})`;

		case 'matrix':
			return `${tf.name}(${tf.data.slice(0,4).map(x => removeLeadingZero(round(x, transformPrecision))).concat(tf.data.slice(4).map(x => removeLeadingZero(round(x, precision)))).join(' ')})`;
	}
}


// not used yet, just gathering it if needed
// the reason is that some sofware leave some floating point errors like 12.300000000005, significant digit is not working there 

// function precisions(transforms) {

// 	const matrixData = transforms.reduce((a,t) => t.name==='matrix'?a.concat(t.data.slice(0, 4)) : a);


// 	const transformPrecision = Math.max(...matrixData.map(x => x.slice(x.indexOf('.')).length-1)) // but this can be fucked if the svg has some floating points errors like 12.300000000005, can be rounded to 8 decimals for example first

// 	const significantDigits = Math.max(...matrixData.map())

// 	const degPrecision = Math.min(precision, 10**significantDigits);

// }


// function significantDigits(n) {
// 	var x = Math.abs(n);
// 	if (x===0) return 0;
// 	var p = Math.floor(Math.log10(x));
// 	if (p>0) x = x / (10**p); 
// 	else if (p<0) x = x * (10**-p);
// 	return (x+'').length-1||1;
// }
