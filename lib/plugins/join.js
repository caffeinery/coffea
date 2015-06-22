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
            } else if (channels && keys) { // join(channels, network)
                network = keys;
            }

            channels = utils.toArray(channels);
            keys = utils.toArray(keys);
            for(var i=0; i < channels.length; i++) {
                var parse = utils.parseTarget(channels[i]);
                this.write('JOIN ' + parse.target + ((keys && keys[i]) ? (' ' + keys[i]) : ''), network ? network : parse.network, fn);
                this.write('WHO ' + parse.target + ' %na');
            }
        };

        irc.cycle = function ircCycle(channels, msg, keys, network, fn) {
          if (!msg) msg = "cycling";
          irc.part(channels, msg, network);
          setTimeout(function () {
              irc.join(channels, keys, network, fn);
          }, 250); // FIXME: no timeout?
        };

        irc.on('data', function (err, msg) {
            var network = msg.network;
            if (msg.command === 'JOIN' && irc.capabilities.indexOf('extended-join') === -1) {
                utils.emit(irc, network, 'join', {
                    "channel": irc.getChannel(msg.trailing, network),
                    "user": irc.getUser(utils.nick(msg), network),
                    "account": null,
                    "realname": null,
                    "tags": msg.tags ? msg.tags : []
                });
            }
        });
    };
};
