/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, stream_id) {
            if (msg.command === 'KICK') {
                var params = msg.params.split(' '),
                    user = irc.getUser(params[1], stream_id),
                    channel = irc.getChannel(params[0].toLowerCase(), stream_id);

                irc.emit('kick', {
                    "channel": channel,
                    "user": user,
                    "by": irc.getUser(utils.nick(msg), stream_id),
                    "reason": msg.trailing,
                    "network": stream_id
                });
            }
        });
    };
};
