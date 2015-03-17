/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.nick = function ircNick(nick, network, fn) {
            if (this.me === null) {
                this.me = this.getUser(nick, network);
            } else {
                this.me.nick = nick;
            }
            this.write('NICK ' + nick, network, fn);
        };

        irc.on('data', function (err, msg) {
            var network = msg.network;
            if (msg.command === 'NICK') {
                var user = irc.getUser(utils.nick(msg), network),
                    oldNick = user.getNick();
                user.nick = msg.params;

                if (oldNick === irc.me.getNick()) {
                    irc.me.nick = user.getNick();
                }

                utils.emit(irc, network, 'nick', {
                    "user": user,
                    "oldNick": oldNick
                });
            }
            if (msg.command === 'ERR_NICKNAMEINUSE') {
                irc.nick(irc.getUser(undefined, network).getNick() + '_'); // FIXME: what is this
            }
        });
    };
};
