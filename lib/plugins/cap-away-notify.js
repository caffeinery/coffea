/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (err, msg) {
            var network = msg.network;
            if (msg.command === 'AWAY') {
                utils.emit(irc, network, 'away-notify', {
                    "user": irc.getUser(utils.nick(msg), network),
                    "message": msg.trailing
                });
            }
        });
    };
};
