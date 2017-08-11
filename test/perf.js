const assert = require('assert');
const fs = require('fs');
// const {stringify, parse} = require('../utils');
const svgz = require('../');
const SVGO = require('svgo');
const svgo = new SVGO({floatPrecision:3, multipass:true, plugins: [
	{removeUselessStrokeAndFill: {removeNone:true}},
	{convertShapeToPath: false}
]});

// const svgStr = fs.readFileSync('/home/caub/Downloads/money.SVG');
const svgStr = fs.readFileSync(__dirname+'/svg/test.svg');

// const svg = parse(svgStr);

console.time('svgo');
svgo.optimize(svgStr).then(res => {
	console.timeEnd('svgo');
	console.log('svgo', res.data.length);
})


console.time('svgz');
const result = svgz(svgStr, {indent:'\t', precision:1e3});
console.timeEnd('svgz');
console.log('svgz', result.length);

/*
on money.svg (1MB)
svgz: 23883.344ms
svgz 939387
svgo: 32743.954ms
svgo 425684
*/


/*
on test.svg:
svgz: 347.330ms
svgz 24778
svgo: 837.271ms
svgo 22353
*/

// console.log(result);

// console.log(svg.querySelectorAll('*').length)

// fs.writeFileSync('test/out2.svg', result);
