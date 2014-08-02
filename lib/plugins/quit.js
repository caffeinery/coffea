/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, stream_id) {
            if (msg.command === 'QUIT') {
                if (msg.string.substr(0, 6) === 'QUIT :') {
                    irc.emit('quit', {
                        "user": irc.me,
                        "message": msg.trailing,
                        "network": stream_id
                    });
                } else {
                    irc.emit('quit', {
                        "user": irc.getUser(utils.nick(msg)),
                        "message": msg.trailing,
                        "network": stream_id
                    });
                }
            }
        });
    };
};
