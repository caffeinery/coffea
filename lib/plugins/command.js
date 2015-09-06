/*jslint node: true*/
"use strict";

var utils = require('../utils');
var debug = require('debug')('irc:command');

module.exports = function () {
    return function (irc) {
        function emitCommand(event, text) {
            var message = irc.splitString(text);
            debug("message: %s", JSON.stringify(message));

            var cmd = message && message.shift();
            debug("cmd: %s", JSON.stringify(cmd));

            utils.emit(irc, event.network, 'command', {
                "channel": event.channel,
                "user": event.user,
                "message": event.text,
                "cmd": cmd,
                "args": message,
                "isAction": event.isAction,
                "tags": event.tags ? event.tags : []
            });
        }

        irc.on('message', function (err, event) {
            var prefix = irc.getInfo(event.network).prefix;
            if (prefix) {
                var text = event.message;
                if (text.substr(0, prefix.length) === prefix) {
                    text = text.substr(prefix.length);
                    debug("command detected: %s", text);

                    emitCommand(event, text);
                }
            }
        });

        irc.on('privatemessage', function (err, event) {
            var text = event.message;

            debug("privatemessage command detected: %s", text);
            emitCommand(event, text);
        });
    };
};
