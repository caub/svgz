const assert = require('assert');
const fs = require('fs');
// const {stringify, parse} = require('../utils');
const svgz = require('../');
const SVGO = require('svgo');
const svgo = new SVGO({floatPrecision:3, multipass:true, plugins: [
  { removeDoctype: false },
  // { removeXMLProcInst: false },
  { removeComments: false },
  // { removeMetadata: false },
  { removeXMLNS: false },
  { removeEditorsNSData: false },
  { cleanupAttrs: false },
  { minifyStyles: false },
  { convertStyleToAttrs: false },
  // { cleanupIDs: false },
  { removeRasterImages: false },
  { removeUselessDefs: false },
  // { cleanupNumericValues: false },
  // { cleanupListOfValues: false },
  { convertColors: false },
  { removeUnknownsAndDefaults: false },
  { removeNonInheritableGroupAttrs: false },
  { removeUselessStrokeAndFill: false },
  { removeViewBox: false },
  { cleanupEnableBackground: false },
  { removeHiddenElems: false },
  { removeEmptyText: false },
  { convertShapeToPath: false },
  // { moveElemsAttrsToGroup: false },
  // { moveGroupAttrsToElems: false },
  // { collapseGroups: false },
  // { convertPathData: false },
  // { convertTransform: false },
  // { removeEmptyAttrs: false },
  { removeEmptyContainers: false },
  { mergePaths: false },
  { removeUnusedNS: false },
  { transformsWithOnePath: false },
  { sortAttrs: false },
  // { removeTitle: false },
  { removeDesc: false },
  { removeDimensions: false },
  { removeAttrs: false },
  { removeElementsByAttr: false },
  { addClassesToSVGElement: false },
  { removeStyleElement: false },
  { removeScriptElement: false },
  { addAttributesToSVGElement: false }
]});

// const svgStr = fs.readFileSync('/home/caub/Downloads/money.SVG');
const svgStr = fs.readFileSync(__dirname+'/svg/test.svg');

// const svg = parse(svgStr);
console.log('initial', svgStr.length)

console.time('svgo');
svgo.optimize(svgStr).then(res => {
	console.timeEnd('svgo');
	console.log('svgo', res.data.length);
})


console.time('svgz');
const result = svgz(svgStr, {indent:'', precision:1e3, plugins: {
  // removeMetadata: false,
  // cleanupIds: false,
  cleanupViewBox: false,
  // moveElemsAttrsToGroup: false,
  // moveGroupAttrsToElems: false,
  // collapseGroups: false,
  // convertPathData: false,
  // convertTransform: false,
  // cleanupNumericValues: false,
  addDefaultFonts: false
}});
console.timeEnd('svgz');
console.log('svgz', result.length);

/*
on test.svg:
initial 28106
svgz: 334.090ms
svgz 23633
 ✓ ok
svgo: 723.714ms
svgo 23760

*/


/*
on money.svg (1MB)
initial 1011684
svgz: 23007.073ms
svgz 914535
svgo: 30918.396ms
svgo 989458
svgo 425684 (with all plugins)
*/


// console.log(result);

// console.log(svg.querySelectorAll('*').length)

// fs.writeFileSync('test/out2.svg', result);
