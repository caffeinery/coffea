/*jslint node: true*/
"use strict";

var utils = require('../utils');

function names(channel, network, fn) {
    // if network is the callback, then it wasn't defined either
    if (typeof(network) == 'function') {
        fn = network;
        network = undefined;
    }
    
    if (typeof channel !== "string") {
        channel = utils.targetString(channel);

        // extract network from channel/user object
        if (!network) network = utils.extractNetwork(target);
    } else channel = channel.toLowerCase();

    var _this = this;
    this.nameCallbacks[channel] = function (names) {
        delete _this.nameCallbacks[channel];
        fn(names);
    };

    this.write('NAMES ' + channel, network);
}

module.exports = function () {
    return function (irc) {
        var nameReply = {};

        irc.names = names;
        irc.nameCallbacks = {};

        irc.on('data', function (msg, network) {
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
                channel = irc.getChannel(channelName, network);
                cb = irc.nameCallbacks[channelName];
                channel.names = nameReply[channelName];
                if (cb) {
                    cb(nameReply[channelName]);
                } else {
                    irc.emit('names', {
                        "channel": channel,
                        "names": nameReply[channelName],
                        "network": network
                    });
                }
                delete nameReply[channelName];
            }
        });
    };
};
