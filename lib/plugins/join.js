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
                utils.emit(irc, network, 'join', {
                    "channel": irc.getChannel(msg.trailing, network),
                    "user": irc.getUser(msg.params, network)
                });
            }
        });
    };
};
