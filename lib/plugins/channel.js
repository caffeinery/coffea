/*jslint node: true, nomen: true*/
"use strict";

var _ = require('underscore');

var Channel = function (name) {
    this.name = name;
    this.topic = {};
    this.names = {};
};

Channel.prototype.toString = function () {
    return this.name;
};

Channel.prototype.getName = function () {
    return this.name;
};

Channel.prototype.getTopic = function () {
    return this.topic;
};

Channel.prototype.getNames = function () {
    return this.names; // {'nick': ['~']}
};

module.exports = function () {
    var channelCache = [],
        channelList = [];
    return function (irc) {

        irc.getChannellist = function () {
            return channelList;
        };

        irc.getChannel = function (name) {
            var channel = _.find(channelCache, function (chan) {
                return chan.getName() === name;
            });
            if (channel === undefined) {
                channel = new Channel(name);
                channelCache.push(channel);
            }
            return channel;
        };

        irc.isChannel = function (channel) {
            return channel instanceof Channel;
        };

        irc.on('join', function (event) {
            //add channel to list if we joined
            if (event.user.getNick() === irc.me.getNick()) {
                channelList.push(event.channel.getName());
                channelList = _.uniq(channelList);
            }
        });

        irc.on('part', function (event) {
            //remove channel from list if we parted
            if (event.user.getNick() === irc.me.getNick()) {
                event.channels.forEach(function (channel) {
                    channelList = _.without(channelList, channel.getName());
                });
            }
        });

        irc.on('kick', function (event) {
            //remove channel from list if we got kicked
            if (event.user.getNick() === irc.me.getNick()) {
                channelList = _.without(channelList, event.channel.getName());
            }
        });
    };
};