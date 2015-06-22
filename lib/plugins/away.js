/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (err, msg) {
            var network = msg.network;
            if (msg.command === 'RPL_AWAY') {
                utils.emit(irc, network, 'away', {
                    "user": irc.getUser(msg.params.split(' ')[1], network),
                    "message": msg.trailing,
                    "tags": msg.tags ? msg.tags : []
                });
            }
        });

        irc.away = function ircAway(reason, network, fn) {
            if (reason !== null) {
                this.write('AWAY :' + reason, network, fn);
            } else {
                this.write('AWAY', network, fn);
            }
        };
    };
};
