(function() {
	Array.prototype.each = function(f) {
		for (var i = 0; i < this.length; i++)
			f(this[i]);
	};
	Array.prototype.map = function(f) {
		var mapped = [];
		this.each(function(e) { mapped.push(f(e)); });
		return mapped;
	};
	Array.prototype.flatten = function() {
		var flattened = [];
		this.each(function(e) {
			if (e.constructor == Array)
				flattened = flattened.concat(e.flatten());
			else
				flattened.push(e);
		});
		return flattened;
	};

	var hasTextContent = false;
	try {
		hasTextContent = typeof (document.createElement("div").textContent) != "undefined";
	} catch (e) {
	}

	function text(e, newValue) {
		if (newValue) {
			if (hasTextContent)
				e.textContent = newValue;
			else
				e.innerText = newValue;
		} else {
			if (hasTextContent)
				return e.textContent;
			else
				return e.innerText;
		}
	}


	var whitespaceRe = /^\s*$/

	function findTokens(pattern, name, str) {
		var matches = str.match(pattern);
		if (matches == null)
			return [str];

		var tokens = [];
		for (var i = 0; i < matches.length; i++) {
			var matchIndex = str.indexOf(matches[i]);

			if (matchIndex > 0)
				tokens.push(textToken(str.substring(0, matchIndex)));

			var matchedString = str.substring(matchIndex, matchIndex + matches[i].length);
			tokens.push({ name: name, value: matchedString });

			str = str.substring(matchIndex + matches[i].length);
		}

		if (str.length > 0)
			tokens.push(textToken(str));

		return tokens;
	}

	function textToken(text) {
		if (whitespaceRe.test(text))
			return { name: null, value: text };
		else
			return text;
	}

	function highlight(src, tokenDefinitions) {
		return tokensToHtml(tokenize(src, tokenDefinitions));
	}

	function tokenize(src, tokenDefinitions) {
		var parts = [src];
		tokenDefinitions.each(function(defn) {
			var className = defn[0];
			var pattern = defn[1];

			parts = parts.map(function(part) {
				if (typeof className != "string" && typeof part == "string") {
					// this is a context tag
					var contextPattern = defn[0];
					var childDefinitions = defn.slice(1);

					var contextTokens = findTokens(contextPattern, "CONTEXT", part);
					return contextTokens.map(function(token) {
						if (typeof token == "string")
							return token;
						else
							return tokenize(token.value, childDefinitions);
					});
				}
				else {
					if (typeof part == "string") {
						return findTokens(pattern, className, part);
					} else {
						return part;
					}
				}
			}).flatten();
		});

		return parts;
	}

	function tokensToHtml(tokens) {
		for (var i = 0; i < tokens.length; i++) {
			if (typeof tokens[i] != "string") {
				if (tokens[i].name)
					tokens[i] = '<span class="' + tokens[i].name + '">' + escapeHTML(tokens[i].value) + '</span>';
				else
					tokens[i] = escapeHTML(tokens[i].value);

			} else {
				tokens[i] = escapeHTML(tokens[i]);
			}
		}

		return tokens.join("");
	}

	var escapeHTMLdiv = document.createElement("div");
	function escapeHTML(s) {
		text(escapeHTMLdiv, s);
		return escapeHTMLdiv.innerHTML;
	}

	var tag = /<[^>]+\/?>/g;

	var patterns = {
		"csharp": [
			["multiline", /\/\*[\s\S]*\*\//g], // multi line comments
			["singleline", /\/\/.*?\n/g],      // single line comments
			["string", /'(\\'|[^'])'/g],       // char literals
			["string", /@"(""|[^"])*"/g],      // literal strings
			["string", /"(\\"|[^"])*"/g],      // strings
			["keyword", /\b(while|volatile|void|virtual|using|ushort|unsafe|unchecked|ulong|uint|typeof|try|true|throw|this|switch|struct|string|static|stackalloc|sizeof|short|sealed|sbyte|return|ref|readonly|public|protected|private|params|override|out|operator|object|null|new|namespace|long|lock|is|internal|interface|int|in|implicit|if|goto|foreach|for|float|fixed|finally|false|extern|explicit|event|enum|else|double|do|delegate|default|decimal|continue|const|class|checked|char|catch|case|byte|break|bool|base|as|abstract|partial)\b/g]
		],
		"vb": [
			["singleline", /'.*?\n/g],         // single line comments
			["string", /'(\\'|[^'])'/g],       // char literals
			["string", /@"(""|[^"])*"/g],      // literal strings
			["string", /"(\\"|[^"])*"/g],      // strings
			["keyword", /\b(Private|Public|Function|Sub|Me|True|False|New|Partial|Class|CType|Shared|End|ByVal|Handles|If|Else|Then|For|As|In|Next|Each|Protected|Return|Imports|Overridable)\b/g]
		],
		"xml": [
			["multiline", /<\!--[\s\S]*?-->/g], // comments
			[tag,
				["string", /"[^"]*"/g],        // attribute strings
				["string", /'[^']*'/g],        // attribute strings with '
				["keyword", /[<>]/g],          // angle brackets
				["keyword", /^\?|\?$/],        // leading or trailing question marks for processing instructions
				["keyword", /\/$/],            // slash before > for self-closing tags
				["keyword", /^\/?[\w:.]+/g],   // element names
				["keyword2", /[\w:]+(?==)/g]   // attribute names
			]
		]
		// "xml2": [
		//     ["multiline", /<\!--[\s\S]*?-->/g], // comments
		//     [/(<)(\w+)((:)(\w+))?(\/?>)/g, "bracket", "element_name", "colon", "element_name", "bracket"]
		//     [tag,
		//         ["string", /"[^"]*"/g],        // attribute strings
		//         ["string", /'[^']*'/g],        // attribute strings with '
		//         ["keyword2", /[<>]/g],         // angle brackets
		//         ["keyword", /^\/?[\w:]+/g]     // element names
		//     ]
		// ]
	}


	function getPatterns(codeblock) {
		var classes = codeblock.className.split(" ");
		for (var i = 0; i < classes.length; i++) {
			if (classes[i] != "highlight" && typeof patterns[classes[i]] != "undefined")
				return patterns[classes[i]];
		}
		return [];
	}

//	var codeblocks = document.getElementsByTagName("pre");
//	for (var i = 0; i < codeblocks.length; i++) {
//		codeblocks[i].innerHTML = highlight(text(codeblocks[i]).replace(/\t/g, "   "), getPatterns(codeblocks[i]));
//	}
})();

// tiny2 
(function() {


	var tag = /<[^>]+\/?>/g;
	var patterns = {
		"csharp": [
			["multiline", /\/\*[\s\S]*\*\//],   // multi line comments
			["singleline", /\/\/.*?\n/],        // single line comments
			["string", /'(?:\\'|[^'])'/],       // char literals
			["string", /@"(?:""|[^"])*"/],      // literal strings
			["string", /"(?:\\"|[^"])*"/],      // strings
			["keyword", /\b(?:while|volatile|void|virtual|using|ushort|unsafe|unchecked|ulong|uint|typeof|try|true|throw|this|switch|struct|string|static|stackalloc|sizeof|short|sealed|sbyte|return|ref|readonly|public|protected|private|params|override|out|operator|object|null|new|namespace|long|lock|is|internal|interface|int|in|implicit|if|goto|foreach|for|float|fixed|finally|false|extern|explicit|event|enum|else|double|do|delegate|default|decimal|continue|const|class|checked|char|catch|case|byte|break|bool|base|as|abstract|partial)\b/]
		],
		"vb": [
			["singleline", /'.*?\n/g],         // single line comments
			["string", /'(\\'|[^'])'/g],       // char literals
			["string", /@"(""|[^"])*"/g],      // literal strings
			["string", /"(\\"|[^"])*"/g],      // strings
			["keyword", /\b(Private|Public|Function|Sub|Me|True|False|New|Partial|Class|CType|Shared|End|ByVal|Handles|If|Else|Then|For|As|In|Next|Each|Protected|Return|Imports|Overridable)\b/g]
		],
		"xml": [
			["multiline", /<\!--[\s\S]*?-->/g], // comments
			[tag,
				["string", /"[^"]*"/g],        // attribute strings
				["string", /'[^']*'/g],        // attribute strings with '
				["keyword", /[<>]/g],          // angle brackets
				["keyword", /^\?|\?$/],        // leading or trailing question marks for processing instructions
				["keyword", /\/$/],            // slash before > for self-closing tags
				["keyword", /^\/?[\w:.]+/g],   // element names
				["keyword2", /[\w:]+(?==)/g]   // attribute names
			]
		]
	};

	function getPatterns(codeblock) {
		var classes = codeblock.className.split(" ");
		for (var i = 0; i < classes.length; i++) {
			if (classes[i] != "highlight" && typeof patterns[classes[i]] != "undefined")
				return patterns[classes[i]];
		}
		return [];
	}

	var hasTextContent = false;
	try {
		hasTextContent = typeof (document.createElement("div").textContent) != "undefined";
	} catch (e) {
	}

	function text(e, newValue) {
		if (newValue) {
			if (hasTextContent)
				e.textContent = newValue;
			else
				e.innerText = newValue;
		} else {
			if (hasTextContent)
				return e.textContent;
			else
				return e.innerText;
		}
	}
	var escapeHTMLdiv = document.createElement("div");
	function escapeHTML(s) {
		text(escapeHTMLdiv, s);
		return escapeHTMLdiv.innerHTML;
	}

	Array.prototype.each = function(f) {
		for (var i = 0; i < this.length; i++)
			f(this[i]);
	};
	Array.prototype.map = function(f) {
		var mapped = [];
		this.each(function(e) { mapped.push(f(e)); });
		return mapped;
	};

	function insert(s, position, toInsert) {
		return s.substring(0, position) + toInsert + s.substring(position);
	}
	function replace(s, startIndex, endIndex, replacement) {
    return s.substring(0, startIndex) + replacement + s.substring(endIndex);
  }
	
	function reString(input) {
    var re = /\/(.*?)\/[gims]*$/;
    return input.toString().match(re)[1];
	}
	
	function highlight(src, tokenDefinitions) {
		var names = tokenDefinitions.map(function(defn) { return defn[0]; });
		var patterns = tokenDefinitions.map(reString);

		var bigPattern = new RegExp("(" + patterns.join(")|(") + ")", "g");
		var m = null, insertedChars = 0;
		while (m = bigPattern.exec(src)) {
			for (var i = 1; i < m.length; i++) {
				if (typeof(m[i]) != "undefined") {
				  // TODO: replace unmatched text with its escaped equivalent
				  // src = replace(src, bigPattern.lastIndex, m.index, escapeHTML()
					var lengthBefore = src.length;
					src = insert(src, m.index + m[i].length, '</span>');
					src = insert(src, m.index, '<span class="' + names[i - 1] + '">');
					bigPattern.lastIndex += (src.length - lengthBefore);
					break;
				}
			}
		}
    
		// MAYBE: change insert/replace to push strings onto a list, then join at the end
		// TODO: replace last unmatched section with html escaped equivalent
		return src;
	}

	var codeblocks = document.getElementsByTagName("pre");
	for (var i = 0; i < codeblocks.length; i++) {
		codeblocks[i].innerHTML = highlight(text(codeblocks[i]).replace(/\t/g, "   "), getPatterns(codeblocks[i]));
	}
})();


