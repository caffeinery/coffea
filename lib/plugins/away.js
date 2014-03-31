/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg) {
            if (msg.command === 'RPL_AWAY') {
                irc.emit('away', {
                    "user": irc.getUser(msg.params.split(' ')[1]),
                    "message": msg.trailing
                });
            }
        });
    };
};