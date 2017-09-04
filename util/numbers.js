
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

exports.roundStringValues = (str, precision, re=/\b([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)\b/g) => str.replace(re, (_,x) => removeLeadingZero(round(x, precision)));


const numRe = /((?:\b|[+-]?)\d*\.?\d+(?:[eE][+-]?\d+)?)\b/g;

const parseNumbers = s => s.match(numRe).map(x => +x);
exports.parseNumbers = parseNumbers;


// function toExponential(x) { // like x.toExponential().replace(/e\+/, 'e')
// 	let n = Math.abs(x);
// 	if (n===0) return 0;
// 	const p = Math.floor(Math.log10(n));
// 	if (p>0) n = n / (10**p);
// 	else if (p<0) n = n * (10**-p);
// 	return (x<0 ? '-' : '')+ n + 'e' + p;
// }

// possibly improve with exponent + float short form (but exponent should be rare, coordinates are normally <1000)
exports.stringifyNumbers = numbers => {
	let result = '';

	for (let i = 0; i < numbers.length; i++) {
		const x = numbers[i];
		if (x < 0) {
			if (x > -1) {
				result += '-' + (x+'').slice(2);
			} else {
				result += x;
			}
		} else {
			if (x > 0 && x < 1) {
				if (Number.isInteger(numbers[i-1])) {
					result += ',';
				}
				result += (x+'').slice(1);
			} else {
				if (i > 0) {
					result += ',';
				}
				result += x;
			}
		}
	}
	return result;
};
