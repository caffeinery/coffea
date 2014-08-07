/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, stream_id) {
            if (msg.command === 'RPL_TOPIC') {
                irc.getChannel(msg.params.split(' ')[1], stream_id).topic.topic = msg.trailing;
            } else if (msg.command === 'RPL_TOPIC_WHO_TIME') {
                var params = msg.params.split(' '),
                    chan = irc.getChannel(params[1], stream_id);
                chan.topic.user = irc.getUser(params[2].split('!')[0]);
                chan.topic.time = new Date(parseInt(params[3], 10) * 1000);
                utils.emit(irc, stream_id, 'topic', {
                    "channel": chan,
                    "topic": chan.topic.topic,
                    "user": chan.topic.user,
                    "time": chan.topic.time,
                    "changed": false
                });
            // this.emit('topic', {
                //     "channel": chan,
                //     "topic": chan.topic.topic,
                //     "user": chan.topic.user,
                //     "time": chan.topic.time,
                //     "changed": false,
                //     "network": stream_id
                // });
            } else if (msg.command === 'TOPIC') {
                var channel = irc.getChannel(msg.params, stream_id);
                channel.topic.topic = msg.trailing;
                channel.topic.user = irc.getUser(utils.nick(msg));
                channel.topic.time = new Date();
                utils.emit(irc, stream_id, 'topic', {
                    "channel": channel,
                    "topic": channel.topic.topic,
                    "user": channel.topic.user,
                    "time": channel.topic.time,
                    "changed": true
                });
                // irc.emit('topic', {
                //     "channel": channel,
                //     "topic": channel.topic.topic,
                //     "user": channel.topic.user,
                //     "time": channel.topic.time,
                //     "changed": true,
                //     "network": stream_id
                // });
            }
        });
    };
};
