/*jslint node: true, nomen: true*/
"use strict";

var utils = require('../utils');
var _ = require('underscore');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, stream_id) {
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
                by = msg.prefix.indexOf('!') > -1 ? irc.getUser(utils.nick(msg)) : msg.prefix;
                channel = (params[0][0] === '#' || params[0][0] === '&') ? irc.getChannel(params[0]) : null;
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
                        irc.emit('mode', {
                            "channel": channel,
                            "by": by,
                            "argument": argument,
                            "adding": adding,
                            "mode": mode,
                            "network": stream_id
                        });
                    } else {
                        var modeArg = null;
                        if (mode.match(/^[bkl]$/)) {
                            modeArg = modeArgs.shift();
                            if (modeArg.length === 0) {
                                modeArg = undefined;
                            }
                        }
                        irc.emit('mode', {
                            "channel": channel,
                            "by": by,
                            "argument": modeArg,
                            "adding": adding,
                            "mode": mode,
                            "network": stream_id
                        });
                    }
                });
            }
        });
    };
};
