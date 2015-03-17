/*jslint node: true*/
"use strict";

var utils = require('../utils');

/**
 * plugin to reply to PINGs.
 *
 * @return {Function}
 * @api public
 */
module.exports = function(){
    return function (irc) {
        irc.on('data', function (err, msg) {
            var network = msg.network;
            if ('PONG' === msg.command) {
                utils.emit(irc, network, 'pong');
            }
            if ('PING' !== msg.command) {
                return;
            }

            irc.write('PONG :' + msg.trailing);
            utils.emit(irc, network, 'ping');
        });
    };
};
