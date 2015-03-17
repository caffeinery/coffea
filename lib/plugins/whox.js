/*jslint node: true*/
"use strict";

// var utils = require('../utils');

/**
 * WHOX handler (for updating user accountnames)
 *
 * @return {Function}
 * @api public
 */
module.exports = function () {
    return function (irc) {
        irc.on('data', function (err, msg) {
            var network = msg.network;
            if (msg.command === '354') {
                msg.trailing = msg.trailing.split(' ');
                var user = irc.getUser(msg.trailing[0], network);
                user.accountname = msg.trailing[1];
                if (msg.trailing[1] === '0') {
                    user.accountname = '';
                }
            }
        });
    };
};
