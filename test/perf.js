const assert = require('assert');
const fs = require('fs');
// const {stringify, parse} = require('../utils');
const svgz = require('../');


// const svgStr = fs.readFileSync('/home/caub/Downloads/money.SVG');
const svgStr = fs.readFileSync(__dirname+'/svg/test.svg');

// const svg = parse(svgStr);


console.time(1);
const result = svgz(svgStr, {indent:'\t', precision:1e3});
console.timeEnd(1);

// console.log(svg.querySelectorAll('*').length)

// fs.writeFileSync('test/out2.svg', result);
