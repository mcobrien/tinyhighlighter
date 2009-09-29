// tiny2 
(function() {
    var tag = /<[^>]+\/?>/g;
    var patterns = {
        "csharp": [
            [   // multi-line comments
                /\/\*[\s\S]*\*\//,
                "multiline"
            ],   
            [   // single line comments
                /\/\/.*?\n/, 
                "singleline"
            ],        
            [   // char literals
                /'(?:\\'|[^'])'/,
                "string"
            ],       
            [   // literal strings
                /@"(?:""|[^"])*"/, 
                "string"
            ],      
            [   // strings
                /"(?:\\"|[^"])*"/, 
                "string"
            ],      
            [   // keywords
                /\b(?:while|volatile|void|virtual|using|ushort|unsafe|unchecked|ulong|uint|typeof|try|true|throw|this|switch|struct|string|static|stackalloc|sizeof|short|sealed|sbyte|return|ref|readonly|public|protected|private|params|override|out|operator|object|null|new|namespace|long|lock|is|internal|interface|int|in|implicit|if|goto|foreach|for|float|fixed|finally|false|extern|explicit|event|enum|else|double|do|delegate|default|decimal|continue|const|class|checked|char|catch|case|byte|break|bool|base|as|abstract|partial)\b/,
                "keyword"
            ]
        ],
        // "vb": [
        //     ["singleline", /'.*?\n/g],         // single line comments
        //     ["string", /'(\\'|[^'])'/g],       // char literals
        //     ["string", /@"(""|[^"])*"/g],      // literal strings
        //     ["string", /"(\\"|[^"])*"/g],      // strings
        //     ["keyword", /\b(Private|Public|Function|Sub|Me|True|False|New|Partial|Class|CType|Shared|End|ByVal|Handles|If|Else|Then|For|As|In|Next|Each|Protected|Return|Imports|Overridable)\b/g]
        // ],
        "xml": [
            [   // comments
                /<\!--[\s\S]*?-->/g, 
                "multiline"
            ], 
            [tag,
                [         
                    [   // leading or trailing question marks for processing instructions
                        /^\?|\?$/,
                        "keyword"
                    ],  
                    [
                        // attribute strings
                        /"[^"]*"/g,
                        "string"
                    ],        
                    [   // attribute strings with '
                        /'[^']*'/g,
                        "string"
                    ],        
                    [   // angle brackets
                        /\/>|[<>]/g,
                        "keyword"
                    ], 
                    [   // attribute names
                        /[\w:.\-]+(?==)/g,
                        "keyword2"
                    ],            
                    [   // element names
                        /\/?[\w:.]+/g,
                        "keyword"
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
        if (s.length == 0)
            return s;
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
        
    function tokenize(src, tokenDefinitions) {
        var names = tokenDefinitions.map(function(defn) { return defn[1]; });
        var patterns = tokenDefinitions.map(function(defn) { return reString(defn[0]); });

        var bigPattern = new RegExp("(" + patterns.join(")|(") + ")", "g");
        var m = null, lastIndex = 0, all = [];
        while (m = bigPattern.exec(src)) {
            for (var i = 1; i < m.length; i++) {
                if (typeof(m[i]) != "undefined") {
                    all.push(src.substring(lastIndex, m.index));
                    
                    if (typeof(names[i - 1]) == "string") {
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

    var codeblocks = document.getElementsByTagName("pre");
    for (var i = 0; i < codeblocks.length; i++) {
        codeblocks[i].innerHTML = highlight(text(codeblocks[i]).replace(/\t/g, "   "), getPatterns(codeblocks[i]));
    }
})();


