/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, network) {
            if (msg.command === 'PRIVMSG') {
                var isAction = false,
                    message = msg.trailing;
                if (msg.trailing.indexOf('\u0001ACTION') === 0) {
                    isAction = true;
                    message = message.slice(8, -1);
                }
                if (irc.me.getNick() === msg.params) {
                    irc.emit('privatemessage', {
                        "user": irc.getUser(utils.nick(msg), network),
                        "message": message,
                        "network": network,
                        "isAction": isAction
                    });
                } else {
                    irc.emit('message', {
                        "channel": irc.getChannel(msg.params, network),
                        "user": irc.getUser(utils.nick(msg), network),
                        "message": message,
                        "network": network,
                        "isAction": isAction
                    });
                }
            }
        });
    };
};
