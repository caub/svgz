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

// const svgStr = fs.readFileSync('./test/test.svg');

const dom = new JSDOM(svgStr);
const svg = dom.window.document.querySelector('svg');

svg.querySelectorAll('*').forEach((x,i) => assert.equal(x.id, 'e'+(i+1)))




// console.log(svg.outerHTML);

// console.log(stringify(svg, '\t'));

assert.equal(
	svgz(svgStr, {indent:'\t'}),
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 -10.02 10 1000" width="50.12%" height="20" x=".27" y="-.24">
	<g id="e1">
		<g id="e2">
			<rect id="e3" width="96" heigth="16"/>
		</g>
		<g id="e4"/>
	</g>
	<g id="e5"/>
</svg>`
);

