/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg) {
            if (msg.command === 'RPL_TOPIC') {
                irc.getChannel(msg.params.split(' ')[1]).topic.topic = msg.trailing;
            } else if (msg.command === 'RPL_TOPIC_WHO_TIME') {
                var params = msg.params.split(' '),
                    chan = irc.getChannel(params[1]);
                chan.topic.user = irc.getUser(params[2].split('!')[0]);
                chan.topic.time = new Date(parseInt(params[3], 10) * 1000);
                this.emit('topic', {
                    "channel": chan,
                    "topic": chan.topic.topic,
                    "user": chan.topic.user,
                    "time": chan.topic.time,
                    "changed": false
                });
            } else if (msg.command === 'TOPIC') {
                var channel = irc.getChannel(msg.params);
                channel.topic.topic = msg.trailing;
                channel.topic.user = irc.getUser(utils.nick(msg));
                channel.topic.time = new Date();
                irc.emit('topic', {
                    "channel": channel,
                    "topic": channel.topic.topic,
                    "user": channel.topic.user,
                    "time": channel.topic.time,
                    "changed": true
                });
            }
        });
    };
};