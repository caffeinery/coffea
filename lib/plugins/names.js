/*jslint node: true*/
"use strict";

var utils = require('../utils');

function names(channel, fn) {
    var self = this;
    channel = this.isChannel(channel) ? channel.getName() : channel.toLowerCase();

    this.nameCallbacks[channel] = function (names) {
        delete self.nameCallbacks[channel];
        fn(names);
    };
    this.write('NAMES ' + channel);
}

module.exports = function () {
    return function (irc) {
        var nameReply = {};

        irc.names = names;
        irc.nameCallbacks = {};

        irc.on('data', function (msg, stream_id) {
            var channelName, channel, cb;
            if (msg.command === 'RPL_NAMREPLY') {
                channelName = msg.params.split(' ')[2];
                nameReply[channelName] = nameReply[channelName] || {};
                msg.trailing.split(' ').forEach(function (name) {
                    var m = name.match(/^((!|~|&|@|%|\+)*)(.*)$/);
                    nameReply[channelName][m[3]] = m[1].split('');
                });
            } else if (msg.command === 'RPL_ENDOFNAMES') {
                channelName = msg.params.split(' ')[1];
                channel = irc.getChannel(channelName, stream_id);
                cb = irc.nameCallbacks[channelName];
                channel.names = nameReply[channelName];
                if (cb) {
                    cb(nameReply[channelName]);
                } else {
                    utils.emit(irc, stream_id, 'names', {
                        "channel": channel,
                        "names": nameReply[channelName]
                    });
                }
                delete nameReply[channelName];
            }
        });
    };
};
