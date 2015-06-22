/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.send = function ircSend(target, msg, network, fn) {
            // if network is the callback, then it wasn't defined either
            // we usually don't need this in every function because client.write does it
            // in this case it's needed because we check for !network later
            if (typeof network === 'function') {
                fn = network;
                network = undefined;
            } else if (typeof msg !== 'string') {
                if (msg !== null && typeof msg === 'object') {
                    msg = JSON.stringify(msg);
                } else {
                    msg = String(msg);
                }
            }

            var parse = utils.parseTarget(target);
            if (!network) { network = parse.network; }
            target = parse.target;

            var _this = this;
            var leading = 'PRIVMSG ' + target + ' :';
            if (!network) network = '0';
            utils.stripMessage(leading, msg, this.networked_me[network], function (str) {
                _this.write(leading + str, network, fn);
            });
            var isAction = false,
                message = msg,
                channel = null,
                user = null,
                event = null;
            if (message.indexOf('\u0001ACTION') === 0) {
                isAction = true;
                message = message.slice(8, -1);
            }
            user = irc.networked_me[network];
            if (target.charAt(0) === '#') {
                event = 'message';
                channel = irc.getChannel(target, network);
                target = channel;
            } else {
                event = 'privatemessage';
                target = irc.getUser(target, network);
            }
            utils.emit(irc, network, "self" + event, {
                "target": target,
                "channel": channel,
                "user": user,
                "message": message,
                "isAction": isAction
            });
        };

        irc.action = function ircAction(target, msg, network, fn) {
            this.send(target, '\u0001' + 'ACTION ' + msg + '\u0001', network, fn);
        };

        irc.on('data', function (err, msg) {
            var network = msg.network;
            if (msg.command === 'PRIVMSG') {
                var isAction = false,
                    message = msg.trailing,
                    channel = null,
                    event = null;
                if (msg.trailing.indexOf('\u0001ACTION') === 0) {
                    isAction = true;
                    message = message.slice(8, -1);
                }
                if (irc.networked_me[network].getNick() === msg.params) {
                    event = 'privatemessage';
                } else {
                    event = 'message';
                    channel = irc.getChannel(msg.params, network);
                }
                utils.emit(irc, network, event, {
                    "channel": channel,
                    "user": irc.getUser(utils.nick(msg), network),
                    "message": message,
                    "isAction": isAction,
                    "tags": msg.tags ? msg.tags : []
                });
            }
        });
    };
};
