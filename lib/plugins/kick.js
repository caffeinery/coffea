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

            // channels = utils.toArray(channels).join(',');
            nicks = utils.toArray(nicks).join(',');
            channels = utils.toArray(channels);

            for(var i=0; i < channels.length; i++) {
                var parse = utils.parseTarget(channels[i]);
                if (msg) {
                    this.write('KICK ' + parse.target + ' ' + nicks +  " :" + msg, parse.network, fn);
                } else {
                    this.write('KICK ' + parse.target + ' ' + nicks, parse.network, fn);
                }
            }

            //this.write('KICK ' + channels + ' ' + nicks + ' :' + msg, network, fn);
        };

        irc.on('data', function (err, msg) {
            var network = msg.network;
            if (msg.command === 'KICK') {
                var params = msg.params.split(' '),
                    user = irc.getUser(params[1], network),
                    channel = irc.getChannel(params[0].toLowerCase(), network);

                utils.emit(irc, network, 'kick', {
                    "channel": channel,
                    "user": user,
                    "by": irc.getUser(utils.nick(msg), network),
                    "reason": msg.trailing,
                    "tags": msg.tags ? msg.tags : []
                });
            }
        });
    };
};
