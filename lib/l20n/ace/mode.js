define(function(require, exports, module) {
"use strict";

var oop = require("ace/lib/oop");
var TextMode = require("ace/mode/text").Mode;
var Tokenizer = require("ace/tokenizer").Tokenizer;
var WorkerClient = require("ace/worker/worker_client").WorkerClient;
var L20nHighlightRules = require("./l20n_highlight_rules").L20nHighlightRules;

var Mode = function() {
    var highlighter = new L20nHighlightRules();
    this.$tokenizer = new Tokenizer(highlighter.getRules());
};
oop.inherits(Mode, TextMode);

(function() {
    // configure comment start/end characters
    this.lineCommentStart = null;  // no single-line comment in l20n
    this.blockComment = {start: "/*", end: "*/"};

    this.createWorker = function(session) {
        var worker = new WorkerClient(["ace", "l20n"], "l20n/ace/l20n_worker", "L20nWorker");
        worker.attachToDocument(session.getDocument());

        worker.on("parsed", function(results) {
            session.setAnnotations(results.data);
        });

        worker.on("terminate", function() {
            session.clearAnnotations();
        });

        return worker;
    };

}).call(Mode.prototype);

exports.Mode = Mode;
});
