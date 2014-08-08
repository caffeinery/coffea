/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, stream_id) {
            if (msg.command === 'INVITE') {
                utils.emit(irc, stream_id, 'invite', {
                    "channel": irc.getChannel(msg.trailing, stream_id),
                    "user": irc.getUser(utils.nick(msg)),
                    "target": irc.getUser(msg.params)
                });
            }
        });
    };
};
