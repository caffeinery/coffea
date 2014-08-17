/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.part = function ircPart(channels, msg, network, fn) {
            if (typeof msg === 'function') {
                fn = msg;
                msg = '';
            }
            this.write('PART ' + utils.toArray(channels).join(',') + ' :' + msg, network, fn);
        };
        
        irc.on('data', function (msg, network) {
            if (msg.command === 'PART') {
                var channelList = msg.params.split(',').map(function (chan) {
                    return irc.getChannel(chan, network);
                });
                utils.emit(irc, network, 'part', {
                    "user": irc.getUser(utils.nick(msg), network),
                    "channels": channelList,
                    "message": msg.trailing
                });
            }
        });
    };
};
