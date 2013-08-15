define(function(require, exports, module) {
"use strict";

var oop = require("ace/lib/oop");
var Mirror = require("ace/worker/mirror").Mirror;

var Parser = require("l20n/parser").Parser;


var L20nWorker = exports.L20nWorker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(500);
    this.parser = new Parser();
    function onError(e) {
        var error = this.doc.indexToPosition(e.pos);
        error.type = 'error';
        error.text = e.message;
        this.errors.push(error);
    };
    this.parser.addEventListener("error", onError.bind(this));
};

oop.inherits(L20nWorker, Mirror);

(function() {
    this.onUpdate = function() {
        var value = this.doc.getValue();
	this.errors = [];
	var rv = this.parser.parse(value);
        this.sender.emit("parsed", this.errors);
    };

}).call(L20nWorker.prototype);

});
