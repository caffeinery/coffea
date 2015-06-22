/*jslint node: true*/
"use strict";

var utils = require('../utils');

/**
 * Names lookup plugin.
 *
 *    client.names('#channel', network, function(err, names){
 *      console.log(names);
 *    });
 *
 * @return {Function}
 * @api public
 */
module.exports = function () {
    return function (irc) {
        /**
         * Fetch names for `channel` and invoke `fn(err, names)`.
         *
         * @param {Object|String} channel
         * @param {String} network
         * @param {Function} fn
         * @api public
         */
        irc.names = function ircNames(channel, network, fn) {
            // if network is the callback, then it wasn't defined either
            if (typeof(network) === 'function') {
                fn = network;
                network = undefined;
            }

            if (typeof channel !== "string") {
                channel = utils.targetString(channel);

                // extract network from channel/user object
                if (!network) {
                    network = utils.extractNetwork(channel);
                }
            } else {
                channel = channel.toLowerCase();
            }

            var _this = this;
            this.nameCallbacks[channel] = function (names) {
                delete _this.nameCallbacks[channel];
                if (fn) {
                    fn(names);
                }
            };

            this.write('NAMES ' + channel, network);
        };

        // here be dragons, eh, listeners...
        var nameReply = {};
        irc.nameCallbacks = {};

        irc.on('data', function (err, msg) {
            var network = msg.network;
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
                }
                delete nameReply[channelName][''];
                utils.emit(irc, network, 'names', {
                    "channel": channel,
                    "names": nameReply[channelName],
                    "tags": msg.tags ? msg.tags : []
                });
                delete nameReply[channelName];
            }
        });
    };
};
