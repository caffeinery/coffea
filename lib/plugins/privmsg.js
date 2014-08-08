/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, stream_id) {
            if (msg.command === 'PRIVMSG') {
                var isAction = false,
                    message = msg.trailing;
                if (msg.trailing.indexOf('\u0001ACTION') === 0) {
                    isAction = true;
                    message = message.slice(8, -1);
                }
                if (irc.me.getNick() === msg.params) {
                    irc.emit('privatemessage', {
                        "user": irc.getUser(utils.nick(msg), stream_id),
                        "message": message,
                        "network": stream_id,
                        "isAction": isAction
                    });
                } else {
                    irc.emit('message', {
                        "channel": irc.getChannel(msg.params, stream_id),
                        "user": irc.getUser(utils.nick(msg), stream_id),
                        "message": message,
                        "network": stream_id,
                        "isAction": isAction
                    });
                }
            }
        });
    };
};
