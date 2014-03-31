/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg) {
            if (msg.command === 'INVITE') {
                irc.emit('invite', {
                    "channel": irc.getChannel(msg.trailing),
                    "user": irc.getUser(utils.nick(msg)),
                    "target": irc.getUser(msg.params)
                });
            }
        });
    };
};