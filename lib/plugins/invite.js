/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, stream_id) {
            if (msg.command === 'INVITE') {
                irc.emit('invite', {
                    "channel": irc.getChannel(msg.trailing, stream_id),
                    "user": irc.getUser(utils.nick(msg), stream_id),
                    "target": irc.getUser(msg.params, stream_id),
                    "network": stream_id
                });
            }
        });
    };
};
