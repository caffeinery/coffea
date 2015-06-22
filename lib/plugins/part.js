/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.part = function ircPart(channels, msg, network, fn) {
            if (typeof msg === 'function') {
                fn = msg;
                msg = '';
            } else {
                fn = network;
            }

            channels = utils.toArray(channels);

            for(var i=0; i < channels.length; i++) {
                var parse = utils.parseTarget(channels[i]);
                if (msg) {
                    this.write('PART ' + parse.target + " :" + msg, parse.network, fn);
                } else {
                    this.write('PART ' + parse.target, parse.network, fn);
                }
            }

            //this.write('PART ' + utils.toArray(channels).join(',') + ' :' + msg, network, fn);
        };

        irc.on('data', function (err, msg) {
            var network = msg.network;
            if (msg.command === 'PART') {
                var channelList = msg.params.split(',').map(function (chan) {
                    return irc.getChannel(chan, network);
                });
                channelList.forEach(function (channel) {
                  utils.emit(irc, network, 'part', {
                      "user": irc.getUser(utils.nick(msg), network),
                      "channel": channel,
                      "message": msg.trailing,
                      "tags": msg.tags ? msg.tags : []
                  });
                });
            }
        });
    };
};
