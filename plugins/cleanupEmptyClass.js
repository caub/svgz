
module.exports = function cleanupEmptyClass(svg) {

	svg.querySelectorAll('[class=""]').forEach(el => el.removeAttribute('class'));
}


module.exports.active = true;

module.exports.description = "remove class attribute when it's empty";