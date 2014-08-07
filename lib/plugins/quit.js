/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, stream_id) {
            if (msg.command === 'QUIT') {
                var user;
                if (msg.string.substr(0, 6) === 'QUIT :') {
                    user = irc.me;
                } else {
                    user = irc.getUser(utils.nick(msg));
                }
                utils.emit(irc, stream_id, 'quit', {
                    "user": user,
                    "message": msg.trailing
                });
            }
        });
    };
};
