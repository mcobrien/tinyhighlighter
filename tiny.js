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
	
	function reString(input) {
    var re = /\/(.*?)\/[gims]*$/;
    return input.toString().match(re)[1];
	}
	
	function highlight(src, tokenDefinitions) {
		var names = tokenDefinitions.map(function(defn) { return defn[0]; });
		var patterns = tokenDefinitions.map(reString);

		var bigPattern = new RegExp("(" + patterns.join(")|(") + ")", "g");
		var m = null, lastIndex = 0, all = [];
		while (m = bigPattern.exec(src)) {
			for (var i = 1; i < m.length; i++) {
				if (typeof(m[i]) != "undefined") {
				  all.push(escapeHTML(src.substring(lastIndex, m.index)));
				  all.push('<span class="' + names[i - 1] + '">');
				  all.push(escapeHTML(m[i]));
				  all.push('</span>');
          lastIndex = bigPattern.lastIndex;
					break;
				}
			}
		}
    
		all.push(escapeHTML(src.substring(lastIndex)));
		return all.join("");
	}

	var codeblocks = document.getElementsByTagName("pre");
	for (var i = 0; i < codeblocks.length; i++) {
		codeblocks[i].innerHTML = highlight(text(codeblocks[i]).replace(/\t/g, "   "), getPatterns(codeblocks[i]));
	}
})();


