
module.exports = function removeMetadata(svg) {

	svg.querySelectorAll('metadata').forEach(el => el.remove());
}


module.exports.active = true;

module.exports.description = 'removes <metadata> elements';