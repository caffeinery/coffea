/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {

        irc.invite = function ircInvite(name, channel, network, fn) {
            name = typeof name === "string" ? name : name.getNick();
            this.write('INVITE ' + name + ' ' + channel, network, fn);
        };

        irc.on('data', function (err, msg) {
            var network = msg.network;
            if (msg.command === 'INVITE') {
                utils.emit(irc, network, 'invite', {
                    "channel": irc.getChannel(msg.trailing, network),
                    "user": irc.getUser(utils.nick(msg), network),
                    "target": irc.getUser(msg.params, network),
                    "tags": msg.tags ? msg.tags : []
                });
            }
        });
    };
};
