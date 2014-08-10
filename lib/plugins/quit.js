/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, network) {
            if (msg.command === 'QUIT') {
                var user;
                if (msg.string.substr(0, 6) === 'QUIT :') {
                    user = irc.me;
                } else {
                    user = irc.getUser(utils.nick(msg), network);
                }
                utils.emit(irc, network, 'quit', {
                    "user": user,
                    "message": msg.trailing
                });
            }
        });
    };
};
