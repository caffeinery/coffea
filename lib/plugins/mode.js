/*jslint node: true, nomen: true*/
"use strict";

var utils = require('../utils');
var _ = require('underscore');

/**
 * MODE plugin to emit "mode" events
 *
 * @return {Function}
 * @api public
 */
module.exports = function () {
    return function (irc) {
        irc.mode = function ircMode(target, flags, network, fn) {
            var parse = utils.parseTarget(target);
            if (!network) { network = parse.network; }
            target = parse.target;

            this.write('MODE ' + target + ' ' + flags, network, fn);
        };

        irc.on('data', function (err, msg) {
            var network = msg.network;
            if (msg.command === 'MODE') {
                var params, modeList, modeArgs, adding, by, channel, argument;

                if (msg.trailing.length > 0) {
                    params = msg.trailing.split(' ');
                    modeList = params[0].split('');
                    modeArgs = params.slice(1);
                    params = msg.params.split(' ');
                } else {
                    params = msg.params.split(' ');
                    modeList = params[1].split('');
                    modeArgs = params.slice(2);
                }

                adding = true;
                by = msg.prefix.indexOf('!') > -1 ? irc.getUser(utils.nick(msg), network) : msg.prefix;
                channel = (params[0][0] === '#' || params[0][0] === '&') ? irc.getChannel(params[0], network) : null;
                modeList.forEach(function (mode) {
                    if (mode === '+') {
                        adding = true;
                        return;
                    }
                    if (mode === '-') {
                        adding = false;
                        return;
                    }
                    if (_.indexOf(['Y', 'q', 'a', 'o', 'h', 'v'], mode) !== -1) {
                        argument = modeArgs.shift() || null;
                        if (channel) {
                            if (adding) {
                                switch (mode) {
                                case 'Y':
                                    channel.names[argument] = '!';
                                    break;
                                case 'q':
                                    channel.names[argument] = '~';
                                    break;
                                case 'a':
                                    channel.names[argument] = '&';
                                    break;
                                case 'o':
                                    channel.names[argument] = '@';
                                    break;
                                case 'h':
                                    channel.names[argument] = '%';
                                    break;
                                case 'v':
                                    channel.names[argument] = '+';
                                    break;
                                }
                            } else {
                                channel.names[argument] = '';
                            }
                        }
                        utils.emit(irc, network, 'mode', {
                            "channel": channel,
                            "by": by,
                            "argument": argument,
                            "adding": adding,
                            "mode": mode
                        });
                    } else {
                        var modeArg = null;
                        if (mode.match(/^[bkl]$/)) {
                            modeArg = modeArgs.shift();
                            if (modeArg.length === 0) {
                                modeArg = undefined;
                            }
                        }
                        utils.emit(irc, network, 'mode', {
                            "channel": channel,
                            "by": by,
                            "argument": modeArg,
                            "adding": adding,
                            "mode": mode
                        });
                    }
                });
            }
        });
    };
};
