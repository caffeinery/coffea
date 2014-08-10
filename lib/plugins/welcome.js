/*jslint node: true*/
"use strict";

var utils = require("../utils");

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, network) {
            if (msg.command === 'RPL_WELCOME') {
                irc.me.nick = msg.params;
                utils.emit(irc, network, 'welcome', {
                    "nick": msg.params,
                    "message": msg.trailing
                });
            }
        });
    };
};
