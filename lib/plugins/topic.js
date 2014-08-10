/*jslint node: true*/
"use strict";

var utils = require('../utils');

/**
 * TOPIC plugin to emit "topic" events.
 *
 * @return {Function}
 * @api public
 */
module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, network) {
            switch (msg.command) {
                case 'RPL_TOPIC':
                    irc.getChannel(msg.params.split(' ')[1], network).topic.topic = msg.trailing;
                    break;
                case 'RPL_TOPIC_WHO_TIME':
                    var params = msg.params.split(' '),
                        chan = irc.getChannel(params[1], network);
                    chan.topic.user = irc.getUser(params[2].split('!')[0], network);
                    chan.topic.time = new Date(parseInt(params[3], 10) * 1000);
                    this.emit('topic', {
                        "channel": chan,
                        "topic": chan.topic.topic,
                        "user": chan.topic.user,
                        "time": chan.topic.time,
                        "changed": false,
                        "network": network
                    });
                    break;
                case 'TOPIC':
                    var channel = irc.getChannel(msg.params, network);
                    channel.topic.topic = msg.trailing;
                    channel.topic.user = irc.getUser(utils.nick(msg), network);
                    channel.topic.time = new Date();
                    irc.emit('topic', {
                        "channel": channel,
                        "topic": channel.topic.topic,
                        "user": channel.topic.user,
                        "time": channel.topic.time,
                        "changed": true,
                        "network": network
                    });
                    break;
            }
        });
    };
};
