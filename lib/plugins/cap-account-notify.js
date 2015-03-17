/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (err, msg) {
            var network = msg.network;
            if (msg.command === 'ACCOUNT') {
                irc.getUser(utils.nick(msg), network).accountname = msg.params === "*" ? null : msg.params;
                utils.emit(irc, network, 'account-login', {
                    "user": irc.getUser(utils.nick(msg), network),
                    "account": msg.params === "*" ? null : msg.params
                });
            }
        });
    };
};
