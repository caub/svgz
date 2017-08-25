## SVG processor and minifier [![Build Status](https://travis-ci.org/caub/svgz.svg?branch=master)](https://travis-ci.org/caub/svgz)

similar to [SVGO](https://github.com/svg/svgo) (many plugins are based from svgo)

```js
const svgz = require('svgz');
const fs = require('fs');

const svgBuf = fs.readFileSync('./test.svg');
// const result = svgz(svgBuf); // call it with default options
// const result = svgz(svgBuf, {indent:'\t', decimals:3}); // call it with different global options
// and with specific plugins options:
const result = svgz(svgBuf, {
	indent:'\t', 
	decimals:3,
	plugins: {
		addDefaultFonts: {families: ['sans-serif']},
		removeMetadata: false // disable this one
	}
});
fs.writeFileSync('./test.min.svg', result);
```

### Plugins

| name | description | active by default |
| --- | --- | :---: |
| removeMetadata | removes `<metadata>` elements | :heavy_check_mark: |
| cleanupIds | removes unused id's attributes | :heavy_check_mark: |
| cleanupViewBox | moves the viewBox origin to 0 0 (and adjust transform on children) |  |
| moveElemsAttrsToGroup | moves up attributes (except transform) to a group wrapper | :heavy_check_mark: |
| moveGroupAttrsToElems | moves some group attributes to the content elements | :heavy_check_mark: |
| collapseGroups | collapses/unwrap useless groups | :heavy_check_mark: |
| convertPathData | optimizes path data: writes in shorter form, applies transformations | :heavy_check_mark: |
| convertTransform | collapses multiple transformations and optimizes it | :heavy_check_mark: |
| cleanupNumericValues | rounds numeric values to the fixed precision, removes default ‘px’ units, and empty attributes | :heavy_check_mark: |
| addDefaultFonts | ensure fallbacks font-family, useful when using web-fonts |  |

### Todos:

- minifyStyles
- removeUselessStrokeAndFills
- removeEmptyTexts
- pathData
- merge tranform in shapes too (circle, rect, line..) when possible and shorter
- ... most svgo plugins and tests