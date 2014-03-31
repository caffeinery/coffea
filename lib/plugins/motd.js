/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        var motd = [];
        irc.on('data', function (msg) {
            if (msg.command === 'RPL_MOTDSTART') {
                motd = [msg.trailing];
            } else if (msg.command === 'RPL_MOTD') {
                motd.push(msg.trailing);
            } else if (msg.command === 'ERR_NOMOTD' || msg.command === 'RPL_ENDOFMOTD') {
                motd.push(msg.trailing);
                irc.emit('motd', motd);
                motd = [];
            }
        });
    };
};