/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.nick = function ircNick(nick, network, fn) {
            if (!network) network = '0';
            this.networked_me[network] = this.getUser(nick, network);
            this.me = this.networked_me[network];
            this.write('NICK ' + nick, network, fn);
        };

        irc.getMe = function ircGetMe(network) {
            if (!network) network = '0';
            var res = this.networked_me[network];
            if (res) res.client = null;
            utils.emit(irc, network, 'getme', {
              "me": res
            });
            return this.networked_me[network];
        };

        irc.on('data', function (err, msg) {
            var network = msg.network;
            if (msg.command === 'NICK') {
                var user = irc.getUser(utils.nick(msg), network);
                if (!user) user = irc.networked_me[network];
                var oldNick = user.nick;
                user.nick = msg.params;

                if (oldNick === irc.networked_me[network].getNick()) {
                    irc.networked_me[network].nick = user.getNick();
                }

                utils.emit(irc, network, 'nick', {
                    "user": user,
                    "oldNick": oldNick,
                    "tags": msg.tags ? msg.tags : []
                });
            }
            if (msg.command === 'ERR_NICKNAMEINUSE') {
                irc.nick(irc.getUser(undefined, network).getNick() + '_'); // FIXME: what is this
            }
        });
    };
};
