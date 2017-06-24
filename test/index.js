const assert = require('assert');
const {JSDOM} = require('jsdom');
const fs = require('fs');
const {stringify} = require('../utils');

const svgz = require('../');


const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="9.99 -10.0221 10 1e3" width="50.124%" height="20" x="0.266" y="-0.235">window
		<g id="e1">
			<g id="e2">
				<rect id="e3" width="96" heigth="16"/>
			</g>
			<g id="e4"></g>
		</g>
		
		<g id="e5"></g>
		
</svg>`;

// const dir = '/home/caub/Downloads/';
// for (const x of fs.readdirSync(dir+'element.line')) {
// 	const s1 = fs.statSync(dir+'element.line/'+x);
// 	const s2 = fs.statSync(dir+'linetest/'+x);
// 	if (s1.size<s2.size) console.log(x)
	// const svgStr = fs.readFileSync(dir+'element.line/'+x);
	// const result = svgz(svgStr, {indent:'', precision:1e3});
	// fs.writeFileSync(dir+'linetest/'+x, result);

// }

// const svgStr = fs.readFileSync(dir+'element.line/1.svg');
// const svg = new JSDOM(svgStr).window.document.querySelector('svg');
// console.log(svg.querySelector('path').getAttribute('d').replace(/\s+/, ''))
// const result = svgz(svg, {indent:'\t', precision:1e3});
// console.log('-------------')
// console.log(svg.querySelector('path').getAttribute('d').replace(/\s+/, ''))
// fs.writeFileSync(dir+'1.svg', result);


// const svgStr = fs.readFileSync('./test/test.svg');

// const svg = new JSDOM(svgStr).window.document.querySelector('svg');


// svg.querySelectorAll('*').forEach((x,i) => assert.equal(x.id, 'e'+(i+1)))

// console.log(svg.getAttribute('height'))

const result = svgz(svgStr, {indent:'\t', precision:1e3});

// fs.writeFileSync('test/out2.svg', result);

assert.equal(
	result,
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="9.99 -10.022 10 1000" width="50.124%" height="20" x=".266" y="-.235">
	<g id="e1">
		<g id="e2">
			<rect id="e3" width="96" heigth="16"/>
		</g>
		<g id="e4"/>
	</g>
	<g id="e5"/>
</svg>`
);


// function getWidthHeightUnit(svg) {
// 	const width = svg.getAttribute('width'), 
// 		height = svg.getAttribute('height');

// 	if((/%$/.test(width)||/%$/.test(height)) && svg.getAttribute('viewBox')) { // try to use viewBox
// 		const [,,w,h] = svg.getAttribute('viewBox').split(/[ ,]/).map(parseFloat);
// 		return {width:w, height:h};
// 	}

// 	if (width && height) {
// 		const unit = width.match(/[a-z]+$/);
// 		return {width: parseFloat(width), height: parseFloat(height), unit: unit?unit[0]:undefined}
// 	}
// 	return {};
// }

// console.log(getWidthHeightUnit(svg))