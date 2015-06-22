/*jslint node: true*/
"use strict";

var utils = require("../utils");

module.exports = function () {
    return function (irc) {
        irc.welcomed = false;

        irc.on('data', function (err, msg) {
            var network = msg.network;
            if (msg.command === 'RPL_WELCOME') {
                irc.networked_me[network] = this.getUser(msg.params, network);
                irc.welcomed = true;
                utils.emit(irc, network, 'welcome', {
                    "nick": msg.params,
                    "message": msg.trailing,
                    "tags": msg.tags ? msg.tags : []
                });
            }
        });
    };
};
