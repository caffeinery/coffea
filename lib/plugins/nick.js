/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg) {
            if (msg.command === 'NICK') {
                var user = irc.getUser(utils.nick(msg)),
                    oldNick = user.getNick();
                user.nick = msg.params;

                if (oldNick === irc.me.getNick()) {
                    irc.me.nick = user.getNick();
                }

                irc.emit('nick', {
                    "user": user,
                    "oldNick": oldNick
                });
            }
        });
    };
};