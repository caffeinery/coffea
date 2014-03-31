/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg) {
            if (msg.command === 'KICK') {
                var params = msg.params.split(' '),
                    user = irc.getUser(params[1]),
                    channel = irc.getChannel(params[0].toLowerCase());

                irc.emit('kick', {
                    "channel": channel,
                    "user": user,
                    "by": irc.getUser(utils.nick(msg)),
                    "reason": msg.trailing
                });
            }
        });
    };
};