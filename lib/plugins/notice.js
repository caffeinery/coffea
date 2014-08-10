/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, network) {
            if (msg.command === 'NOTICE') {
                irc.emit('notice', {
                    "from": msg.prefix.indexOf('!') > -1 ? irc.getUser(utils.nick(msg), network) : msg.prefix,
                    "to": msg.params.toLowerCase(),
                    "message": msg.trailing,
                    "network": network
                });
            }
        });
    };
};
