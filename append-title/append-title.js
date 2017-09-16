(function () {
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