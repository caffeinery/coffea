/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, network) {
            if (msg.command === 'INVITE') {
                irc.emit('invite', {
                    "channel": irc.getChannel(msg.trailing, network),
                    "user": irc.getUser(utils.nick(msg), network),
                    "target": irc.getUser(msg.params, network),
                    "network": network
                });
            }
        });
    };
};
