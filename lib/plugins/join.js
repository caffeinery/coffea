/*jslint node: true*/
"use strict";

var utils = require('../utils');

/**
 * JOIN plugin to emit "join" events
 *
 * @return {Function}
 * @api public
 */
module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, network) {
            if (msg.command === 'JOIN') {
                irc.emit('join', {
                    "user": irc.getUser(utils.nick(msg), network),
                    "channel": irc.getChannel(msg.params || msg.trailing, network),
                    "network": network
                });
            }
        });
    };
};