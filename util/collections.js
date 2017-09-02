
// http://www.w3.org/TR/SVG/intro.html#Definitions
exports.elemsGroups = {
	animation: ['animate', 'animateColor', 'animateMotion', 'animateTransform', 'set'],
	descriptive: ['desc', 'metadata', 'title'],
	shape: ['circle', 'ellipse', 'line', 'path', 'polygon', 'polyline', 'rect'],
	structural: ['defs', 'g', 'svg', 'symbol', 'use'],
	paintServer: ['solidColor', 'linearGradient', 'radialGradient', 'meshGradient', 'pattern', 'hatch'],
	nonRendering: ['linearGradient', 'radialGradient', 'pattern', 'clipPath', 'mask', 'marker', 'symbol', 'filter', 'solidColor'],
	container: ['a', 'defs', 'g', 'marker', 'mask', 'missing-glyph', 'pattern', 'svg', 'switch', 'symbol', 'foreignObject'],
	textContent: ['altGlyph', 'altGlyphDef', 'altGlyphItem', 'glyph', 'glyphRef', 'textPath', 'text', 'tref', 'tspan'],
	textContentChild: ['altGlyph', 'textPath', 'tref', 'tspan'],
	lightSource: ['feDiffuseLighting', 'feSpecularLighting', 'feDistantLight', 'fePointLight', 'feSpotLight'],
	filterPrimitive: ['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence']
};


// https://www.w3.org/TR/SVG/linking.html#processingIRI
exports.referencesAttrs = new Set([
	'clip-path',
	'color-profile',
	'fill',
	'filter',
	'marker-start',
	'marker-mid',
	'marker-end',
	'mask',
	'stroke',
	'style'
]);

// http://www.w3.org/TR/SVG/propidx.html
exports.inheritableAttrs = new Set([
	'clip-rule',
	'color',
	'color-interpolation',
	'color-interpolation-filters',
	'color-profile',
	'color-rendering',
	'cursor',
	'direction',
	'fill',
	'fill-opacity',
	'fill-rule',
	'font',
	'font-family',
	'font-size',
	'font-size-adjust',
	'font-stretch',
	'font-style',
	'font-variant',
	'font-weight',
	'glyph-orientation-horizontal',
	'glyph-orientation-vertical',
	'image-rendering',
	'kerning',
	'letter-spacing',
	'marker',
	'marker-end',
	'marker-mid',
	'marker-start',
	'pointer-events',
	'shape-rendering',
	'stroke',
	'stroke-dasharray',
	'stroke-dashoffset',
	'stroke-linecap',
	'stroke-linejoin',
	'stroke-miterlimit',
	'stroke-opacity',
	'stroke-width',
	'text-anchor',
	'text-rendering',
	'transform',
	'visibility',
	'white-space',
	'word-spacing',
	'writing-mode'
]);