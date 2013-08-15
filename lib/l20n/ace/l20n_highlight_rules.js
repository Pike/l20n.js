define(function(require, exports, module) {
"use strict";
var oop = require("ace/lib/oop");
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;
var L20nHighlightRules = function() {
    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used
   this.$rules = {
        "start" : [
            {
                token: 'comment', // String, Array, or Function: the CSS token to apply
                regex: '/\\*',     // String or RegExp: the regexp to match
                next:  'comment'  // [Optional] String: next state to enter
            },
	    {
		token: 'constant.language',
		regex: '<',
		next: 'unit'
	    }
        ],
        "comment" : [
	    {
		token: 'comment',
		regex: '.*?\\*/',
		next: 'start'
	    }
        ],
        "unit" : [
	    {
		token: 'variable',
		regex: '[_a-zA-Z]\\w*',
		next: 'in_unit'
	    }
	],
        "in_unit": [
	    {
		token: 'constant.language',
		regex: '>',
		next: 'start'
	    },
	    {
		token: 'constant.language',
		regex: '\\(',
		next: 'macro_args'
	    }
        ],
        "macro_args": [
	    {
		token: 'variable',
		regex: '\\$[_a-zA-Z]\\w*'
	    },
	    {
		token: 'constant.language',
		regex: '\\)',
		next: 'macro_body'
	    }
	],
        "macro_body": [
	    {
		token: 'constant.language',
		regex: '}',
		next: 'in_unit'
	    }
	 ]
    };
};
oop.inherits(L20nHighlightRules, TextHighlightRules);
exports.L20nHighlightRules = L20nHighlightRules;
});