// order matters

exports.removeMetadata = require('./removeMetadata');
exports.removeUselessIds = require('./removeUselessIds');
exports.removeViewBoxOffset = require('./removeViewBoxOffset');

exports.cleanupEmptyClass = require('./cleanupEmptyClass');

exports.moveElemsAttrsToGroup = require('./moveElemsAttrsToGroup');
exports.moveGroupAttrsToElems = require('./moveGroupAttrsToElems');
exports.collapseGroups = require('./collapseGroups');
exports.convertTransform = require('./convertTransform');

exports.cleanupNumericValues = require('./cleanupNumericValues');
exports.addDefaultFonts = require('./addDefaultFonts');

