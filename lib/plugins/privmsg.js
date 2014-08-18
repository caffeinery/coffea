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
            utils.stripMessage(leading, msg, this.me, function (str) {
                _this.write(leading + str, network, fn);
            });
        };

        irc.action = function ircAction(target, msg, network, fn) {
            this.send(target, '\u0001' + 'ACTION ' + msg + '\u0001', network, fn);
        };
        
        irc.on('data', function (msg, network) {
            if (msg.command === 'PRIVMSG') {
                var isAction = false,
                    message = msg.trailing,
                    channel = null,
                    event = null;
                if (msg.trailing.indexOf('\u0001ACTION') === 0) {
                    isAction = true;
                    message = message.slice(8, -1);
                }
                if (irc.me.getNick() === msg.params) {
                    event = 'privatemessage';
                } else {
                    event = 'message';
                    channel = irc.getChannel(msg.params, network);
                }
                utils.emit(irc, network, event, {
                    "channel": channel,
                    "user": irc.getUser(utils.nick(msg), network),
                    "message": message,
                    "isAction": isAction
                });
            }
        });
    };
};
