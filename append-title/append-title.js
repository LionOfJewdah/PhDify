function joinRegExpsWithDelim(delim = "|", ...rest) {
    var components = [],
        arg;

    for (var i = 0; i < rest.length; i++) {
        arg = rest[i];
        if (arg instanceof RegExp) {
            components = components.concat(arg._components || arg.source);
        }
    }

    var combined = new RegExp("(?:" + components.join(")" + delim + "(?:") + ")");
    combined._components = components; // For chained calls to "or" method
    return combined;
};

RegExp.any = joinRegExpsWithDelim.bind(null, "|");
RegExp.sequence = joinRegExpsWithDelim.bind(null, "");

RegExp.prototype.or = function() {
    var args = Array.prototype.slice.call(arguments);
    return RegExp.any.apply(null, [this].concat(args));
};

RegExp.prototype.chain = function () {
	var args = Array.prototype.slice.call(arguments);
    return RegExp.sequence.apply(null, [this].concat(args));
};

RegExp.prototype.followedBy = function (regex) {
	// var sauce = regex;
	// if (regex instanceof RegExp)
	// 	sauce = regex.source;
	return this.chain(new RegExp("(?=" + regex.source + ")"));
};

RegExp.prototype.notFollowedBy = function (regex) {
	return this.chain(new RegExp("(?!" + regex.source + ")"));
};

var miller_regex = /(J\.?|Jeff|Jeffrey)\s+Miller/gi;
var miller_regex_lower = /j_*miller/gi;
var miller_comma = /(Miller)(,\s+J(\.|eff(rey)?)?)/g;

var PHD_MATCH = /(?:,(_|\s)*)?Ph\.?[^\S\n]*D/gi;
var untitled_miller_regex = miller_regex.notFollowedBy(PHD_MATCH);
//console.log("untitled miller is", untitled_miller_regex);
var untitled_miller_lower = miller_regex_lower.notFollowedBy(PHD_MATCH);


function macroAppend(text, suffix) {
	console.log("Appending", "\"" + suffix + "\"", "to", "\'" + text + "\'.");
	return text + suffix;
}

function appendPhDSimple(text) {
	return macroAppend(text, ", Ph.D.");
}

function append_phd(text) {
	return macroAppend(text, "_phd");
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
		} /*
		else {
			console.log(attr, attributes[attr]);
		}
		*/
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
		//window.console.log(currentNode.nodeName);
		currentNode.textContent = PhDify(currentNode.textContent);
	} /*
	else {
		window.console.log(currentNode.nodeType, currentNode.innerHTML);
	}
	*/
}

function PhDify(str) {
	return str.replace(untitled_miller_regex, appendPhDSimple)
		.replace(untitled_miller_lower, append_phd);
		// .replace(miller_comma, function(match, p1, p2) { return p1 + " Ph.D." + p2;})
}