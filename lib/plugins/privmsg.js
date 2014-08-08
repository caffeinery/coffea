/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, stream_id) {
            if (msg.command === 'PRIVMSG') {
                var isAction = false,
                    message = msg.trailing,
                    channel = null,
                    event = null;
                if (msg.trailing.indexOf('\u0001ACTION') === 0) {
                    isAction = true;
                    message = message.slice(8, -1);
                }
                if (irc.me.getNick() === msg.params) {
                    event = 'privatemessage';
                } else {
                    event = 'message';
                    channel = irc.getChannel(msg.params, stream_id);
                }
                utils.emit(irc, stream_id, event, {
                    "channel": channel,
                    "user": irc.getUser(utils.nick(msg)),
                    "message": message,
                    "isAction": isAction
                });
            }
        });
    };
};
