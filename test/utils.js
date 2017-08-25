const assert = require('assert');
const {round, removeLeadingZero, roundStringValues, 
	stringify, parse, stringifyNumbers,
	toAbsolute, toRelativeRound, toRelative,
	parsePathData
} = require('../utils');

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

const data = [2.003, -1.21, 8.3, 9.3, -6.667, 3.333, 10, -20, 33.406868,3.1426,5.930639,47.965545,2.919855,32.47886,23.551591,0.624626,11.122716,39.449927,27.628906,53.532457,25.338128,2.326637,21.651916,24.322714,39.764629,15.799856,36.230786,31.367954];

const rounder = x => round(x, 1e2);

assert.deepEqual(
	data.map(rounder),
	toAbsolute(Object.assign(toRelative(data), {'-1':0, '-2':0})).map(rounder)
);


assert.deepEqual(
	data.map(rounder),
	toRelative(toAbsolute(data)).map(rounder)
);

assert.deepEqual(
	data.map(rounder).slice(-2),
	toAbsolute(Object.assign(toRelativeRound(data, 1e2), {'-1':0, '-2':0})).map(rounder).slice(-2)
);

assert.deepEqual(
	parsePathData('m0,.2A25,30,20,1,1,7,8l-8-7m20,-10v-40M4,4l2.2 6.3-16.3.2h8-2zl50'),
	[ 
		{ type: 'm', values: [ 0, 0.2 ] },
		{ type: 'A', values: [ 25, 30, 20, 1, 1, 7, 8 ] },
		{ type: 'l', values: [ -8, -7 ] },
		{ type: 'm', values: [ 20, -10 ] },
		{ type: 'v', values: [ -40 ] },
		{ type: 'M', values: [ 4, 4 ] },
		{ type: 'l', values: [ 2.2, 6.3 ] },
		{ type: 'l', values: [ -16.3, 0.2 ] },
		{ type: 'h', values: [ 8 ] },
		{ type: 'h', values: [ -2 ] },
		{ type: 'z' } 
	]
);
