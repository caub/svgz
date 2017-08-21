const assert = require('assert');
const {round, removeLeadingZero, roundStringValues, stringify, parse, stringifyNumbers} = require('../utils');

assert.deepEqual(
	[ 0.99, 10.2, 0, 0, -0.5, 100.1, -900.045 ].map(removeLeadingZero),
	[ '.99', 10.2, 0, 0, '-.5', 100.1, -900.045 ]
);

assert.equal(round(-0.24580, 1e2), -0.25);


assert.equal(
	roundStringValues('11.042819316255512 545.6129991817525 3.884523422467454e2 35.398893970883296', 100),
	'11.04 545.61 388.45 35.4'
);


assert.equal(stringifyNumbers([ 1 ]),       '1');
assert.equal(stringifyNumbers([ 1, 2, 3 ]), '1,2,3');

assert.equal(stringifyNumbers([ 1.2 ]),          '1.2');
assert.equal(stringifyNumbers([ 1.2, .2 ]),      '1.2.2');
assert.equal(stringifyNumbers([ 1.2, .3, 4.5 ]), '1.2.3,4.5');

assert.equal(stringifyNumbers([ -1 ]),        '-1');
assert.equal(stringifyNumbers([ -1, -2, 3 ]), '-1-2,3');
assert.equal(stringifyNumbers([ 1, -2, -3 ]), '1-2-3');
assert.equal(stringifyNumbers([ 1, -2, 3 ]),  '1-2,3');


// parse / stringify

const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="9.99 -10.0221 10 1e3" width="50.124%" height="20" x="0.266" y="-0.235">
		<g id="e1">
			<g id="e2">
				<rect id="e3" width="96" heigth="16"/>
			</g>
			<g id="e4"></g>
		</g>
		
		<g id="e5"></g>
		
</svg>`;

const svg = parse(svgStr);

const result = stringify(svg, '\t');

assert.equal(
	result,
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="9.99 -10.0221 10 1e3" width="50.124%" height="20" x="0.266" y="-0.235">
	<g id="e1">
		<g id="e2">
			<rect id="e3" width="96" heigth="16"/>
		</g>
		<g id="e4"/>
	</g>
	<g id="e5"/>
</svg>`
);

const result2 = stringify(svg);

assert.equal(
	result2,
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="9.99 -10.0221 10 1e3" width="50.124%" height="20" x="0.266" y="-0.235"><g id="e1"><g id="e2"><rect id="e3" width="96" heigth="16"/></g><g id="e4"/></g><g id="e5"/></svg>`
);