var Message = require(__dirname + '/Message.js');
var Tag = require(__dirname + '/Tag.js');

var parse = require(__dirname + '/parser.js');

module.exports.parse = parse;
module.exports.Message = Message;
module.exports.Tag = Tag;