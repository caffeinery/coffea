var format = {
	'reset': '\x0F',
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
	'darkgray': '\x0314',
	'lgray': '\x0315',
	'lightgray': '\x0315',
	'white': '\x0316',
	'bold': '\x02',
	'underline': '\x1F',
	'normal': '\x0F',
	'italic': '\x1D',
	'swap': '\x16', // this might be displayed as italic by some clients
	'zwsp': '\u200b'
};

module.exports = function () {
	return function (irc) {
		irc.format = format;

		irc.format.get = function (formatting) {
			return format[formatting];
		};

		irc.format.unhighlight = function (message) {
			return message.split('').join(irc.format.zwsp);
		};

		try {
			irc.emoji = require('node-emoji').emoji;
		} catch (err) {
			irc.emoji = {}; // node-emoji not available, no emoji loaded
		}

		try {
			irc.kaomoji = require('node-kaomoji').kaomoji;
		} catch (err) {
			irc.kaomoji = {}; // node-kaomoji not available, no kaomoji loaded
		}
	};
};
