/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.kick = function ircKick(channels, nicks, msg, network, fn) {
            if (typeof msg === 'function') {
                fn = msg;
                msg = '';
            }

            channels = utils.toArray(channels).join(',');
            nicks = utils.toArray(nicks).join(',');
            this.write('KICK ' + channels + ' ' + nicks + ' :' + msg, network, fn);
        };
        
        irc.on('data', function (msg, network) {
            if (msg.command === 'KICK') {
                var params = msg.params.split(' '),
                    user = irc.getUser(params[1], network),
                    channel = irc.getChannel(params[0].toLowerCase(), network);

                utils.emit(irc, network, 'kick', {
                    "channel": channel,
                    "user": user,
                    "by": irc.getUser(utils.nick(msg), network),
                    "reason": msg.trailing
                });
            }
        });
    };
};