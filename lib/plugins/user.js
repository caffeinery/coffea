/*jslint node: true, nomen: true, unparam: true*/
"use strict";

var _ = require('lodash');

var User = function (nick, client, network) {
    this.nick = nick;
    this.client = client;
    this.network = network;
    this.channels = {};
    this.idle = 0;
    this.signon = new Date();

    // hide `client` property
    Object.defineProperty(this, 'client', {
        enumerable: false,
        writable: true
    });
};

User.prototype.toString = function () {
    // only return string if we can construct a valid string
    if (this.nick && this.username && this.hostname) {
        return this.nick + '!' + this.username + '@' + this.hostname;
    }
};

User.prototype.getNick = function () {
    return this.nick;
};

User.prototype.getNetwork = function () {
    return this.network;
};

User.prototype.getUsername = function () {
    return this.username ? this.username : '';
};

User.prototype.getRealname = function () {
    return this.realname ? this.realname : '';
};

User.prototype.getHostname = function () {
    return this.hostname ? this.hostname : '';
};

User.prototype.getAccountName = function () {
    return this.accountname ? this.accountname : '';
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
    return this.registered ? true : false;
};

User.prototype.isUsingSecureConnection = function () {
    return this.secure ? true : false;
};

User.prototype.getIdle = function () {
    return this.idle;
};

User.prototype.getSignonTime = function () {
    return this.signon;
};

User.prototype.isOper = function () {
    return this.oper ? true : false;
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

        irc.getUser = function (nick, network) {
            if (!nick) {
                if (!network) {
            network = '0';
        }
                return irc.networked_me[network];
            }
            var user = _.find(userCache, function (usr) {
                if (network) {
                    return (usr.getNick() === nick) && (usr.getNetwork() === network);
                } else {
                    return usr.getNick() === nick;
                }
            });
            if (user === undefined) {
                user = new User(nick, irc, network);
                userCache.push(user);
            }
            return user;
        };

        irc.isUser = function (user) {
            return user instanceof User;
        };

        irc.isMe = function (user) {
            // TODO: maybe compare user objects instead of just nicks here?
            return user.getNick() === irc.networked_me[user.getNetwork()].getNick();
        };

        var removeUser = function (nick, network) {
            nick = typeof nick === "string" ? nick : nick.getNick();
            userCache = _.filter(userCache, function (user) {
                return (user.getNick() !== nick) && (user.getNetwork() !== network);
            });
        };

        irc.on('join', function (err, event) {
            //add user to channellist
            event.channel.names[event.user.getNick()] = [];
        });

        function _removeUser(err, event) {
            var network = event.network;

            //remove user from channellist
            delete event.channel.names[event.user.getNick()];

            //check if we know the user from another channel. if not, remove him from usercache.
            var found = false;
            irc.getChannelList(network).forEach(function (channelName) {
                _.each(irc.getChannel(channelName, network).getNames(), function (mode, nick) {
                    if (event.user.getNick() === nick) {
                        found = true;
                    }
                });
            });
            if (!found) {
                removeUser(event.user);
            }
    }
    irc.on('part', _removeUser);
        irc.on('kick', _removeUser);

        irc.on('quit', function (err, event) {
            //remove user from usercache
            removeUser(event.user);
        });

        irc.on('data', function (err, msg) {
            var network = msg.network;
            if (msg.command === '396') {
                irc.networked_me[network].hostname = msg.params.split(' ')[1];
            } else if (msg.command === 'RPL_WHOREPLY') {
                var params = msg.params.split(' '),
                    user = irc.getUser(params[5], network);
                user.username = params[2];
                user.hostname = params[3];
                user.server = params[4];
                user.realname = msg.trailing.split(' ')[1];
            }
        });
    };
};
