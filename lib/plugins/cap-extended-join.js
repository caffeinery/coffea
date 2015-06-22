/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (err, msg) {
            var network = msg.network;
            if (msg.command === 'JOIN' && irc.capabilities.indexOf('extended-join') > -1) {
                utils.emit(irc, network, 'join', {
                    "channel": irc.getChannel(msg.params.split(' ')[0], network),
                    "user": irc.getUser(utils.nick(msg), network),
                    "account": msg.params.split(' ')[1] === "*" ? null : msg.params.split(' ')[1],
                    "realname": msg.trailing,
                    "tags": msg.tags ? msg.tags : []
                });
            }
        });
    };
};
