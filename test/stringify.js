const {stringify, parse} = require('../utils');


const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="9.99 -10.0221 10 1e3" width="50.124%" height="20" x="0.266" y="-0.235">window
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

console.assert(
	result == `<svg xmlns="http://www.w3.org/2000/svg" viewBox="9.99 -10.0221 10 1e3" width="50.124%" height="20" x="0.266" y="-0.235">
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

console.assert(
	result2 == `<svg xmlns="http://www.w3.org/2000/svg" viewBox="9.99 -10.0221 10 1e3" width="50.124%" height="20" x="0.266" y="-0.235"><g id="e1"><g id="e2"><rect id="e3" width="96" heigth="16"/></g><g id="e4"/></g><g id="e5"/></svg>`
);