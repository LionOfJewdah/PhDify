(function () {
	var miller_regex = /(J.?|Jeff|Jeffrey)\s*Miller/gi;
	var miller_regex_lower = /j.?[_\s]*miller/gi;
	var miller_comma = /(Miller)(,\s*J(.|eff(rey)?)?)/g;

	var PHD_MATCH = /(?:(_*|,\s*))?Ph.?[^\Sn]*D/gi;
	var PHD_MATCH_CASE_INSENSITIVE = /(?:(_*|,\s*))?[pP][hH].?[^\Sn]*[dD]/g;

	var untitled_miller_regex = miller_regex.notFollowedBy(PHD_MATCH).makeGlobalAndCaseInsensitive();
	// console.log("untitled miller is: " + untitled_miller_regex);
	var untitled_miller_lower = miller_regex_lower.notFollowedBy(PHD_MATCH_CASE_INSENSITIVE).globalize();

	function PhDify(str) {
		var transformations = [RegexReplaceObj(untitled_miller_lower, append_phd),
			RegexReplaceObj(untitled_miller_regex, appendPhDSimple),
			RegexReplaceObj(miller_comma, appendBeforeComma)
		]
		return transformAllReplacements(str, transformations);
	}

	var currentNode,
		ni = document.createNodeIterator(document.documentElement, NodeFilter.SHOW_ELEMENT);

	while (currentNode = ni.nextNode()) {
		if (!(currentNode.children[0])) {
			currentNode.textContent = PhDify(currentNode.textContent);
		}
	}
})()