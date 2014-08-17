var format = {
	'reset': '\x0300\x0F',
	'black': '\x0301',
	'navy': '\x0302',
	'green': '\x0303',
	'red': '\x0304',
	'brown': '\x0305',
	'purple': '\x0306',
	'olive': '\x0307',
	'yellow': '\x0308',
	'lime': '\x0309',
	'teal': '\x0310',
	'aqua': '\x0311',
	'blue': '\x0312',
	'pink': '\x0313',
	'dgray': '\x0314',
	'lgray': '\x0315',
	'white': '\x0316',
	'bold': '\x02',
	'underline': '\x1F',
	'normal': '\x0F',
	'italic': '\x16'
};

module.exports = function () {
	return function (irc) {
		irc.format = format;
		irc.emoji = require('node-emoji').emoji;
	};
};