var miller_regex = /(J\.?|Jeff|Jeffrey)\s+Miller/gi;
var miller_regex_lower = /jmiller/gi;
var miller_comma = /(Miller)(,\s+J(\.|eff(rey)?)?)/g;

function appendPhDSimple(text) {
	console.log(text);
	return text + ", Ph.D."
}

function append_phd(text) {
	return text + "_phd";
}

// window.console.log("LEEE");

function elt(tagName, class_, text, attributes) {
	var dom = document.createElement(tagName);
	if (class_)
		dom.className = class_;
	if (text)
		dom.innerHTML = text;
	for (var attr in attributes) {
		if (attributes.hasOwnProperty(attr)) {
			dom.setAttribute(attr, attributes[attr]);
		} else {
			console.log(attr, attributes[attr]);
		}
	}
	return dom;
}

function findOrMakeElement(query, tagName, class_, text, attributes) {
	return document.querySelector(query) || elt(tagName, class_, text, attributes);
}

window.document.body.appendChild(findOrMakeElement("#found", "h1", "big", "IT MATCHES THIS PAGE", {id: "found"}));

var currentNode,
    ni = document.createNodeIterator(document.documentElement, NodeFilter.SHOW_ELEMENT);

while (currentNode = ni.nextNode()) {
	if (!(currentNode.children[0])) {
		window.console.log(currentNode.nodeName);
		currentNode.textContent = PhDify(currentNode.textContent);
	} else {
		window.console.log(currentNode.nodeType, currentNode.innerHTML);
	}
}

function PhDify(str) {
	return str.replace(miller_regex, appendPhDSimple)
		.replace(miller_regex_lower, append_phd);
		// .replace(miller_comma, function(match, p1, p2) { return p1 + " Ph.D." + p2;})
}