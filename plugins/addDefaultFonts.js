
module.exports = function addDefaultFonts(svg, {families=['Helvetica','sans-serif']}={}) {

	svg.querySelectorAll('[style*="font-family"]').forEach(el => {
		if (el.style.fontFamily) {
			el.style.fontFamily = formatFamily(el.style.fontFamily, families);
		}
	});

	svg.querySelectorAll('[font-family]').forEach(el => {
		if (el.getAttribute('font-family')) {
			el.setAttribute('font-family', formatFamily(el.getAttribute('font-family'), families));
		}
	});
}

module.exports.active = false;

module.exports.description = 'ensure fallbacks font-family, useful when using web-fonts';



const formatFamily = (fontFamily, defaultFamilies) =>
	[...new Set(fontFamily.split(/\s*,\s*/).filter(x=>x).concat(defaultFamilies))].join(',');


/*
ex: <text style="font-family:'Open Sans';font-weight:600">Test</text>
-> <text style="font-family:'Open Sans',Helvetica,sans-serif;font-weight:600">Test</text>

*/