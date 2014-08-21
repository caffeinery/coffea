/*jslint node: true*/
"use strict";

var utils = require('../utils');

/**
 * JOIN plugin to emit "join" events
 *
 * @return {Function}
 * @api public
 */
module.exports = function () {
    return function (irc) {
        irc.join = function ircJoin(channels, keys, network, fn) {
            if (typeof keys === 'function') { // join(channels, fn)
                fn = keys;
                network = undefined;
                keys = '';
            } else if (typeof network === 'function') { // join(channels, network, fn)
                fn = network;
                network = keys;
            }

            channels = utils.toArray(channels);
            keys = utils.toArray(keys);
            for(var i=0; i < channels.length; i++) {
                var parse = utils.parseTarget(channels[i]);
                this.write('JOIN ' + parse.target + ((keys && keys[i]) ? (' ' + keys[i]) : ''), parse.network, fn);
                this.write('WHO ' + parse.target + ' %na');
            }
            //this.write('JOIN ' + utils.toArray(channels).join(',') + ' ' + utils.toArray(keys).join(','), network, fn);
        };
        
        irc.on('data', function (msg, network) {
            if (msg.command === 'JOIN' && irc.capabilities.indexOf('extended-join') === -1) {
                utils.emit(irc, network, 'join', {
                    "channel": irc.getChannel(msg.trailing, network),
                    "user": irc.getUser(utils.nick(msg), network),
                    "account": null,
                    "realname": null
                });
            }
        });
    };
};
