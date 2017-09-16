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
	return this.chain(new RegExp("(?=" + regex.source + ")"));
};

RegExp.prototype.notFollowedBy = function (regex) {
	return this.chain(new RegExp("(?!" + regex.source + ")"));
};

function globalize(regex) {
	if (regex.global)
		return regex;
	return new RegExp(regex.source || regex, (regex.flags || '') + 'g');
}

function ignoreCase(regex) {
	if (regex.ignoreCase)
		return regex;
	return new RegExp(regex.source || regex, (regex.flags || '') + 'i');
}

function ignoreCaseGlobally(regex) {
	if (regex.ignoreCase)
		return globalize(regex);
	if (regex.global)
		return ignoreCase(regex);
	return new RegExp(regex.source || regex, (regex.flags || '') + 'gi');
}

RegExp.prototype.globalize = function () { return globalize(this); };

RegExp.prototype.makeCaseInsensitive = function () { return ignoreCase(this); };

RegExp.prototype.makeGlobalAndCaseInsensitive = function() { return ignoreCaseGlobally(this); };

var miller_regex = /(J.?|Jeff|Jeffrey)\s*Miller/gi;
var miller_regex_lower = /j.?[_\s]*miller/gi;
var miller_comma = /(Miller)(,\s*J(.|eff(rey)?)?)/g;

var PHD_MATCH = /(?:(_*|,\s*))?Ph.?[^\Sn]*D/gi;
var PHD_MATCH_CASE_INSENSITIVE = /(?:(_*|,\s*))?[pP][hH].?[^\Sn]*[dD]/g;

var untitled_miller_regex = miller_regex.notFollowedBy(PHD_MATCH).makeGlobalAndCaseInsensitive();
// console.log("untitled miller is: " + untitled_miller_regex);
var untitled_miller_lower = miller_regex_lower.notFollowedBy(PHD_MATCH_CASE_INSENSITIVE).globalize();


function macroAppend(text, suffix) {
	return text + suffix;
}

function appendPhDSimple(text) {
	return macroAppend(text, ", Ph.D.");
}

function append_phd(text) {
	return macroAppend(text, "_phd");
}

function insertTextAfterFirstMatch(infix, p1, p2) {
	return p1 + ' ' + infix + p2;
}

function appendBeforeComma(match, p1, p2) { 
	return insertTextAfterFirstMatch("PhD", p1, p2);
}

var RegexReplacementSchema = {
	regex: "",
	replacement: ""
};

function RegexReplaceObj(regex, replacement) {
	var rv = Object.create(RegexReplacementSchema);
	rv.regex = regex; rv.replacement = replacement;
	return rv;
}

function transformAllReplacements(str, rest) {
	rest.forEach(function (item, index, array) {
		str = str.replace(item.regex, item.replacement);
	});
	return str;
}
