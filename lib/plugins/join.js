/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, stream_id) {
            if (msg.command === 'JOIN') {
                irc.emit('join', {
                    "user": irc.getUser(utils.nick(msg)),
                    "channel": irc.getChannel(msg.trailing),
                    "network": stream_id
                });
            }
        });
    };
};
