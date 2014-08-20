var Stream = require('stream');
var linewise = require('linewise');

var parser = require('./parser');
var utils = require('../utils');

var Parser = function Parser() {
    this.writable = true;
    this.nlstream = linewise.getPerLineBuffer();
    this.nlstream.on('data', this.ondata.bind(this));
    this.nlstream.resume();
};

utils.inherit(Parser, Stream);

Parser.prototype.write = function write (data) {
    this.nlstream.write(data);
};

Parser.prototype.ondata = function ondata (line) {
    var message = parser.parse(line);

    this.emit('message', message);
};

Parser.prototype.end = function end () {
    this.emit('end');
};

module.exports = Parser;