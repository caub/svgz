const assert = require('assert');
const fs = require('fs');
// const {stringify, parse} = require('../utils');
const svgz = require('../');
const SVGO = require('svgo');
const svgo = new SVGO({floatPrecision:3, multipass:true, plugins: [
	{removeUselessStrokeAndFill: {removeNone:true}},
	{convertShapeToPath: false},
	{convertPathData: false},
	{mergePaths: false},
	{minifyStyles: false},
	{removeEmptyAttrs: false},
	{removeEmptyContainers: false},
	{removeEmptyText: false},
	{removeHiddenElems: false},
	{removeNonInheritableGroupAttrs: false}
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
svgz: 23511.927ms
svgz 930384
svgo: 32743.954ms
svgo 977025  425684 (with all plugins)
*/


/*
on test.svg:
svgz: 301.661ms
svgz 24971
svgo: 706.678ms
svgo 23376
*/

// console.log(result);

// console.log(svg.querySelectorAll('*').length)

// fs.writeFileSync('test/out2.svg', result);
