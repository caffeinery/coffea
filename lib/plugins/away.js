/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, network) {
            if (msg.command === 'RPL_AWAY') {
                utils.emit(irc, network, 'away', {
                    "user": irc.getUser(msg.params.split(' ')[1], network),
                    "message": msg.trailing
                });
            }
        });
    };
};
