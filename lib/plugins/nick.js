/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, network) {
            if (msg.command === 'NICK') {
                var user = irc.getUser(utils.nick(msg), network),
                    oldNick = user.getNick();
                user.nick = msg.params;

                if (oldNick === irc.me.getNick()) {
                    irc.me.nick = user.getNick();
                }

                irc.emit('nick', {
                    "user": user,
                    "oldNick": oldNick,
                    "network": network
                });
            }
            if (msg.command === 'ERR_NICKNAMEINUSE') {
                irc.nick(irc.getUser(undefined, network).getNick() + '_');
            }
        });
    };
};