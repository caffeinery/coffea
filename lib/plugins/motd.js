/*jslint node: true*/
"use strict";

var utils = require('../utils');

/**
 * MOTD plugin to emit "motd" events
 *
 * @return {Function}
 * @api public
 */
module.exports = function () {
    return function (irc) {
        var motd = [];
        irc.on('data', function (err, msg) {
            var network = msg.network;
            switch (msg.command) {
                case 'RPL_MOTDSTART':
                  utils.emit(irc, network, 'connect');
                  utils.emit(irc, network, 'coffeaconnect');
                  motd = [msg.trailing];
                  break;
                case 'RPL_MOTD':
                  motd.push(msg.trailing);
                  break;
                case 'ERR_NOMOTD':
                case 'RPL_ENDOFMOTD':
                  motd.push(msg.trailing);
                  utils.emit(irc, network, 'motd', {motd: motd});
                  motd = [];
                  break;
            }
        });
    };
};
