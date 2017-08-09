## SVG processor and minifier [![Build Status](https://travis-ci.org/caub/svgz.svg?branch=master)](https://travis-ci.org/caub/svgz)

similar to [SVGO](https://github.com/svg/svgo)

```js
const svgz = require('svgz');
const fs = require('fs');

const svgBuf = fs.readFileSync('./test.svg');
// const result = svgz(svgBuf); // call it with default options
// const result = svgz(svgBuf, {indent:'\t', decimals:2}); // call it with different global options
// or with specific filters options:
const result = svgz(svgBuf, {indent:'\t', decimals:2}, {addDefaultFonts: {families: ['sans-serif']}});
fs.writeFileSync('./out.svg', result);
```


### Todos:

- port https://github.com/svg/svgo/blob/master/plugins/convertTransform.js
- collapse groups after it
- minifyStyles
- removeUselessStrokeAndFills
- removeEmptyTexts