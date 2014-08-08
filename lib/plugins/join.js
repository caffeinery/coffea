/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, stream_id) {
            if (msg.command === 'JOIN') {
                utils.emit(irc, stream_id, 'join', {
                    "channel": irc.getChannel(msg.trailing, stream_id),
                    "user": irc.getUser(msg.params)
                });
            }
        });
    };
};
