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
        irc.topic = function ircTopic(channel, topic, network, fn) {
            var parse = utils.parseTarget(channel);
            if (!network) { network = parse.network; }
            channel = parse.target;
            channel = typeof channel !== "string" ? channel.getName() : channel;
            if (typeof topic === 'function') {
                fn = topic;
                topic = '';
            }
            this.write('TOPIC ' + channel + ' :' + topic, network, fn);
        };

        irc.on('data', function (err, msg) {
            var network = msg.network;
            switch (msg.command) {
                case 'RPL_TOPIC':
                    irc.getChannel(msg.params.split(' ')[1], network).topic.topic = msg.trailing;
                    break;
                case 'RPL_TOPIC_WHO_TIME':
                    var params = msg.params.split(' '),
                        chan = irc.getChannel(params[1], network);
                    chan.topic.user = irc.getUser(params[2].split('!')[0], network);
                    chan.topic.time = new Date(parseInt(params[3], 10) * 1000);
                    utils.emit(irc, network, 'topic', {
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
                    utils.emit(irc, network, 'topic', {
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
