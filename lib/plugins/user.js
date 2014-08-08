/*jslint node: true, nomen: true, unparam: true*/
"use strict";

var _ = require('underscore');

var User = function (nick, client, network) {
    this.nick = nick;
    this.client = client;
    this.network = network;
    this.username = '';
    this.realname = '';
    this.hostname = '';
    this.channels = {};
    this.server = '';
    this.serverInfo = '';
    this.away = null;
    this.account = null;
    this.registered = false;
    this.secure = false;
    this.idle = 0;
    this.signon = new Date();
    this.oper = false;
};

User.prototype.toString = function () {
    return this.nick + '!' + this.username + '@' + this.hostname;
};

User.prototype.getNick = function () {
    return this.nick;
};

User.prototype.getNetwork = function () {
    return this.network;
};

User.prototype.getUsername = function () {
    return this.username;
};

User.prototype.getRealname = function () {
    return this.realname;
};

User.prototype.getHostname = function () {
    return this.hostname;
};

User.prototype.getChannels = function () {
    return this.channels; // {'#channel': ['~']}
};

User.prototype.getServer = function () {
    return this.server;
};

User.prototype.getServerInfo = function () {
    return this.serverInfo;
};

User.prototype.getAway = function () {
    return this.away;
};

User.prototype.getAccount = function () {
    return this.account;
};

User.prototype.isRegistered = function () {
    return this.registered;
};

User.prototype.isUsingSecureConnection = function () {
    return this.secure;
};

User.prototype.getIdle = function () {
    return this.idle;
};

User.prototype.getSignonTime = function () {
    return this.signon;
};

User.prototype.isOper = function () {
    return this.oper;
};

User.prototype.notice = function (msg) {
    this.client.notice(this.getNick(), msg, this.network);
};

User.prototype.say = function (msg) {
    this.client.send(this.getNick(), msg, this.network);
};

User.prototype.whois = function (fn) {
    // TODO: we should put this.network at the same position everywhere
    this.client.whois(this.getNick(), fn, this.network);
};

module.exports = function () {
    var userCache = [];
    return function (irc) {

        irc.getUser = function (nick, stream_id) {
            if (!nick) {
                return irc.me;
            }
            var user = _.find(userCache, function (usr) {
                return (usr.getNick() === nick) && (usr.getNetwork() === stream_id);
            });
            if (user === undefined) {
                user = new User(nick, irc, stream_id);
                userCache.push(user);
            }
            return user;
        };

        irc.isUser = function (user) {
            return user instanceof User;
        };

        var removeUser = function (nick, stream_id) {
            nick = typeof nick === "string" ? nick : nick.getNick();
            userCache = _.filter(userCache, function (user) {
                return (user.getNick() !== nick) && (user.getNetwork() !== stream_id);
            });
        };

        irc.on('join', function (event, stream_id) {
            //add user to channellist
            event.channel.names[event.user.getNick()] = [];
        });

        irc.on('part', function (event, stream_id) {
            //remove user from channellist
            event.channels.forEach(function (channel) {
                delete channel.names[event.user.getNick()];
            });

            //check if we know the user from another channel. if not, remove him from usercache.
            var found = false;
            irc.getChannellist().forEach(function (channelName) {
                _.each(irc.getChannel(channelName, stream_id).getNames(), function (mode, nick, list) {
                    if (event.user.getNick() === nick) {
                        found = true;
                    }
                });
            });
            if (!found) {
                removeUser(event.user);
            }
        });

        irc.on('kick', function (event, stream_id) {
            //remove user from channellist
            delete event.channel.names[event.user.getNick()];

            //check if we know the user from another channel. if not, remove him from usercache.
            var found = false;
            irc.getChannellist().forEach(function (channelName) {
                _.each(irc.getChannel(channelName, stream_id).getNames(), function (mode, nick, list) {
                    if (event.user.getNick() === nick) {
                        found = true;
                    }
                });
            });
            if (!found) {
                removeUser(event.user);
            }
        });

        irc.on('quit', function (event, stream_id) {
            //remove user from usercache
            removeUser(event.user);
        });

        irc.on('data', function (msg, stream_id) {
            if (msg.command === '396') {
                irc.me.hostname = msg.params.split(' ')[1];
            } else if (msg.command === 'RPL_WHOREPLY') {
                var params = msg.params.split(' '),
                    user = irc.getUser(params[5], stream_id);
                user.username = params[2];
                user.hostname = params[3];
                user.server = params[4];
                user.realname = msg.trailing.split(' ')[1];
            }
        });
    };
};
