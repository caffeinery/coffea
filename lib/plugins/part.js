/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, network) {
            if (msg.command === 'PART') {
                var channelList = msg.params.split(',').map(function (chan) {
                    return irc.getChannel(chan, network);
                });
                irc.emit('part', {
                    "user": irc.getUser(utils.nick(msg), network),
                    "channels": channelList,
                    "message": msg.trailing,
                    "network": network
                });
            }
        });
    };
};
