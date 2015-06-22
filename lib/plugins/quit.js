/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        /**
         * Quit the network.
         *
         * @param {String} message
         * @param {String} network
         * @param {Function} fn
         * @api public
         */
        irc.quit = function ircQuit(msg, network, fn) {
            msg = msg || '';
            if (msg) {
                this.write('QUIT :' + msg, network, fn);
            } else {
                this.write('QUIT', network, fn);
            }
        };

        irc.on('data', function (err, msg) {
            var network = msg.network;
            if (msg.command === 'QUIT') {
                var user;
                if (msg.string.substr(0, 6) === 'QUIT :') {
                    user = irc.networked_me[network];
                } else {
                    user = irc.getUser(utils.nick(msg), network);
                }
                utils.emit(irc, network, 'quit', {
                    "user": user,
                    "message": msg.trailing,
                    "tags": msg.tags ? msg.tags : []
                });
            }
        });
    };
};
