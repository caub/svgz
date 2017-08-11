## SVG processor and minifier [![Build Status](https://travis-ci.org/caub/svgz.svg?branch=master)](https://travis-ci.org/caub/svgz)

similar to [SVGO](https://github.com/svg/svgo)

```js
const svgz = require('svgz');
const fs = require('fs');

const svgBuf = fs.readFileSync('./test.svg');
// const result = svgz(svgBuf); // call it with default options
// const result = svgz(svgBuf, {indent:'\t', decimals:3}); // call it with different global options
// or with specific filters options:
const result = svgz(svgBuf, {indent:'\t', decimals:3}, {addDefaultFonts: {families: ['sans-serif']}});
fs.writeFileSync('./test.min.svg', result);
```

### Filters

| name | description | active by default |
| --- | --- | :---: |
| removeMetadata | removes <metadata> elements | :heavy_check_mark: |
| removeUselessIds | removes useless id attributes | :heavy_check_mark: |
| removeViewBoxOffset | moves the viewBox origin to 0 0 |  |
| moveElemsAttrsToGroup | moves elements attributes to the existing group wrapper |  |
| moveGroupAttrsToElems | moves some group attributes to the content elements |  |
| collapseGroups | collapses useless groups |  |
| convertTransform | collapses multiple transformations and optimizes it |  |
| cleanupNumericValues | rounds numeric values to the fixed precision, removes default ‘px’ units | :heavy_check_mark: |
| addDefaultFonts | ensure fallbacks font-family, useful when using web-fonts | :heavy_check_mark: |

### Todos:

- [ ] port https://github.com/svg/svgo/blob/master/plugins/convertTransform.js
- collapse groups after it
- minifyStyles
- removeUselessStrokeAndFills
- removeEmptyTexts
- [ ] use getPathData (+polyfill) to make code fully isomorphic