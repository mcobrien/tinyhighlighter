// tinyhighlight
// 
//
// 
(function() {
    var tag = /<[^>]+\/?>/g;
    var patterns = {
        "csharp": [
			[   // multi-line comments
				/\/\*[\s\S]*?\*\//,
				"ml"
			],
			[   // single line comments
				/\/\/[^\n]+/,
				"sl"
			],
			[   // char literals
				/'(?:\\'|[^'])'/,
				"s"
			],
			[   // literal strings
				/@"(?:""|[^"])*"/,
				"s"
			],
			[   // strings
				/"(?:\\"|[^"])*"/,
				"s"
			],
			[   // numbers
				/\b[0-9][0-9.]*\b/,
				"n"
			],
			[   // keywords
				/\b(?:while|volatile|void|virtual|using|ushort|unsafe|unchecked|ulong|uint|typeof|try|true|throw|this|switch|struct|string|static|stackalloc|sizeof|short|sealed|sbyte|return|ref|readonly|public|protected|private|params|override|out|operator|object|null|new|namespace|long|lock|is|internal|interface|int|in|implicit|if|goto|foreach|for|float|fixed|finally|false|extern|explicit|event|enum|else|double|do|delegate|default|decimal|continue|const|class|checked|char|catch|case|byte|break|bool|base|as|abstract|partial)\b/,
				"kw"
			]
		],
        "java": [
			[   // multi-line comments
				/\/\*[\s\S]*?\*\//,
				"ml"
			],
			[   // single line comments
				/\/\/[^\n]+/,
				"sl"
			],
			[   // char literals
				/'(?:\\'|[^'])'/,
				"s"
			],
			[   // strings
				/"(?:\\"|[^"])*"/,
				"s"
			],
			[   // numbers
				/\b[0-9][0-9.]*\b/,
				"n"
			],
			[   // keywords
				/\b(?:abstract|continue|for|new|switch|assert|default|goto|package|synchronized|boolean|do|if|private|this|break|double|implements|protected|throw|byte|else|import|public|throws|case|enum|instanceof|return|transient|catch|extends|int|short|try|char|final|interface|static|void|class|finally|long|strictfp|volatile|const|float|native|super|while)\b/,
				"kw"
			]
		],
        "javascript": [
			[   // multi-line comments
				/\/\*[\s\S]*?\*\//,
				"ml"
			],
			[   // single line comments
				/\/\/.*?\n/,
				"sl"
			],
			[   // char literals
				/'(?:\\'|[^'])'/,
				"s"
			],
			[   // strings
				/"(?:\\"|[^"])*"/,
				"s"
			],
			[   // numbers
				/\b[0-9][0-9.]*\b/,
				"n"
			],
			[   // keywords
				/\b(?:abstract|implements|protected|boolean|instanceof|public|byte|int|short|char|interface|static|double|long|synchronized|false|native|throws|final|null|transient|float|package|true|goto|private|catch|enum|throw|class|extends|try|const|finally|debugger|super)\b/,
				"kw"
			]
		],
        "c": [
			[   // multi-line comments
				/\/\*[\s\S]*?\*\//,
				"ml"
			],
			[   // single line comments
				/\/\/.*?\n/,
				"sl"
			],
			[   // char literals
				/'(?:\\'|[^'])'/,
				"s"
			],
			[   // strings
				/"(?:\\"|[^"])*"/,
				"s"
			],
			[   // numbers
				/\b[0-9][0-9.]*\b/,
				"n"
			],
			[   // keywords
				/\b(?:and|and_eq|asm|auto|bitand|bitor|bool|break|case|catch|char|class|compl|const|const_cast|continue|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|FALSE|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|not|not_eq|operator|or|or_eq|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_cast|struct|switch|template|this|throw|TRUE|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while|xor|xor_eq)\b/,
				"kw"
			],
			[   // preprocessor instructions
				/(?:^|\n)\#\w+(?:\\\s*\n|[^\n])*(?=\n)/,
				"o"
			],
			[   // operators
				/==|\!=|=|\*|\+|\-|%|&|\||<|>|\?/,
				"o"
			]
		],
        "ruby": [
			[   // single line comments
				/#.*?\n/,
				"sl"
			],
			[   // ' strings
				/'(?:\\'|[^'])*'/,
				"s"
			],
			[   // " strings
				/"(?:""|[^"])*"/,
				"s"
			],
			[   // numbers
				/\b[0-9][0-9.]*\b/,
				"n"
			],
			[   // qualified class names
				/[a-zA-Z_]+[a-zA-Z0-9]*::[a-zA-Z_]+[a-zA-Z0-9]*/,
				"kw3"
			],
			[   // symbols
				/:[a-zA-Z_]+[a-zA-Z0-9]*/,
				"kw2"
			],
			[   // keywords
				/\b(?:alias|and|begin|begin|break|case|class|def|defined|do|else|elsif|end|end|ensure|false|for|if|in|include|module|next|nil|not|or|redo|rescue|retry|return|self|super|then|true|undef|unless|until|when|while|yield)\b/,
				"kw"
			],
			[   // operators
				/==|=~|\!~|\!=|<=>|=>|=|\*|\+|\-|%|&|<|>|\?/,
				"o"
			]
		],
        "python": [
			[   // single line comments
				/#.*?\n/,
				"sl"
			],
			[   // ' strings
				/'(?:\\'|[^'])*'/,
				"s"
			],
			[   // " strings
				/"(?:""|[^"])*"/,
				"s"
			],
			[   // numbers
				/\b[0-9][0-9.]*\b/,
				"n"
			],
			[   // keywords
				/\b(?:and|del|from|not|while|as|elif|global|or|with|assert|else|if|pass|yield|break|except|import|print|class|exec|in|raise|continue|finally|is|return|def|for|lambda|try)\b/,
				"kw"
			],
			[   // special names
				/\b(?:__\w+__)\b/,
				"kw2"
			],
			[   // operators
				/==|=~|\!~|\!=|<=>|=>|=|\*|\+|\-|%|&|<|>|\?/,
				"o"
			]
		],
        "vb": [
			[   // single line comments
				/'.*?\n/,
				"sl"
			],
			[   // char literals
				/'(?:\\'|[^'])'/,
				"s"
			],
			[   // literal strings
				/@"(?:""|[^"])*"/,
				"s"
			],
			[   // strings
				/"(?:\\"|[^"])*"/,
				"s"
			],
			[   // numbers
				/\b[0-9][0-9.]*\b/,
				"n"
			],
			[   // keywords
				/\b(?:Private|Public|Function|Sub|Me|True|False|New|Partial|Class|CType|Shared|End|ByVal|Handles|If|Else|Then|For|As|In|Next|Each|Protected|Return|Imports|Overridable)\b/,
				"kw"
			]
		],
        "sql": [
			[   // single line comments
				/--.*?\n/,
				"sl"
			],
			[   // strings
				/'(?:\\'|[^'])*'/,
				"s"
			],
			[   // numbers
				/\b[0-9][0-9.]*\b/,
				"n"
			],
			[   // keywords
				/\b(?:add|except|percent|all|exec|plan|alter|execute|precision|and|exists|primary|any|exit|print|as|fetch|proc|asc|file|procedure|authorization|fillfactor|public|backup|for|raiserror|begin|foreign|read|between|freetext|readtext|break|freetexttable|reconfigure|browse|from|references|bulk|full|replication|by|function|restore|cascade|goto|restrict|case|grant|return|check|group|revoke|checkpoint|having|right|close|holdlock|rollback|clustered|identity|rowcount|coalesce|identity_insert|rowguidcol|collate|identitycol|rule|column|if|save|commit|in|schema|compute|index|select|constraint|inner|session_user|contains|insert|set|containstable|intersect|setuser|continue|into|shutdown|convert|is|some|create|join|statistics|cross|key|system_user|current|kill|table|current_date|left|textsize|current_time|like|then|current_timestamp|lineno|to|current_user|load|top|cursor|national|tran|database|nocheck|transaction|dbcc|nonclustered|trigger|deallocate|not|truncate|declare|null|tsequal|default|nullif|union|delete|of|unique|deny|off|update|desc|offsets|updatetext|disk|on|use|distinct|open|user|distributed|opendatasource|values|double|openquery|varying|drop|openrowset|view|dummy|openxml|waitfor|dump|option|when|else|or|where|end|order|while|errlvl|outer|with|escape|over|writetext|count|avg|sum)\b/,
				"kw"
			]
		],
        "xml": [
			[   // comments
				/<\!--[\s\S]*?-->/g,
				"ml"
			],
			[tag,
				[
					[   // leading or trailing question marks for processing instructions
						/^\?|\?$/,
						"kw"
					],
					[   // attribute strings
						/"[^"]*"/g,
						"s"
					],
					[   // attribute strings with '
						/'[^']*'/g,
						"s"
					],
					[   // angle brackets
						/\/>|[<>]/g,
						"o"
					],
					[   // attribute names
						/[\w:.\-]+(?==)/g,
						"kw2"
					],
					[   // element names
						/\/?[\w:.]+/g,
						"kw"
					]
				]
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

    // Check if we have a textContent property - this is used for cross-browser compatibility
    var hasTextContent = false;
    try {
        hasTextContent = typeof (document.createElement("div").textContent) != "undefined";
    } catch (e) {
    }

    // Gets or sets the text of a node
    function text(e, newValue) {
        if (newValue) {
            if (hasTextContent)
                e.textContent = newValue;
            else
                e.innerText = newValue;
        } else {
            if (hasTextContent)
                return e.textContent.replace(/\r\n/g, "\n");
            else {
                replaceBRWithNewline(e);
                return e.innerText.replace(/\r\n/g, "\n");
            }
        }
    }

    function replaceBRWithNewline(e) {
        for (var i = 0; i < e.childNodes.length; i++) {
            if (e.childNodes[i].nodeName == "BR") {
                var nl = document.createTextNode("\n");
                insertAfter(nl, e.childNodes[i]);
                e.childNodes[i].parentNode.removeChild(e.childNodes[i]);
            }
        }
    }

    function insertAfter(e, old) {
        var clone = old.cloneNode(true);
        old.parentNode.insertBefore(clone, old);
        old.parentNode.replaceChild(e, old);
    }

    var escapeHTMLdiv = document.createElement("div");
    function escapeHTML(s) {
        if (s.length == 0)
            return s;
        text(escapeHTMLdiv, s);
        return escapeHTMLdiv.innerHTML;
    }

    function each(a, f) {
        for (var i = 0; i < a.length; i++)
            f(a[i]);
    };

    function map(a, f) {
        var mapped = [];
        each(a, function(e) { mapped.push(f(e)); });
        return mapped;
    };

    function reString(input) {
        var re = /\/(.*?)\/[gims]*$/;
        return input.toString().match(re)[1];
    }

    function tokenize(src, tokenDefinitions) {

        if (tokenDefinitions.length == 0)
            return [src];

        var names = map(tokenDefinitions, function(defn) { return defn[1]; });
        var patterns = map(tokenDefinitions, function(defn) { return reString(defn[0]); });

        var bigPattern = new RegExp("(" + patterns.join(")|(") + ")", "gi");
        var m = null, lastIndex = 0, all = [];
        while (m = bigPattern.exec(src)) {
            for (var i = 1; i < m.length; i++) {
                if (typeof (m[i]) != "undefined" && m[i] != "") {
                    // push the unmatched text up to here
                    all.push(src.substring(lastIndex, m.index));

                    if (typeof (names[i - 1]) == "string") {
                        // push the match, surrounded by tags
                        all.push('__LT__span class="' + names[i - 1] + '"__GT__');
                        all.push(m[i]);
                        all.push('__LT__/span__GT__');
                    }
                    else {
                        // this has sub patterns
                        all = all.concat(tokenize(m[i], names[i - 1]));
                    }

                    lastIndex = bigPattern.lastIndex;
                    break;
                }
            }
        }

        all.push(src.substring(lastIndex));
        return all;
    }

    function highlight(src, tokenDefinitions) {
        var all = tokenize(src, tokenDefinitions);
        return escapeHTML(all.join("")).replace(/__LT__/g, "<").replace(/__GT__/g, ">");
    }

    window.tinyHighlight = function(element, language) {
        var codeblocks = element ? [element] : document.getElementsByTagName("pre");
        for (var i = 0; i < codeblocks.length; i++) {
            var syntax = language ? patterns[language] : getPatterns(codeblocks[i]);
            codeblocks[i].innerHTML = highlight(text(codeblocks[i]).replace(/\t/g, "   "), syntax);
        }
    }

    window.tinyHighlight();
})();


