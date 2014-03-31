/*jslint node: true*/
"use strict";

var utils = require('../utils');

function whois(target, fn) {
    var self = this;
    if (fn) {
        this.whoisCallbacks[target] = function (err, data) {
            delete self.whoisCallbacks[target];
            fn(err, data);
        };
    }
    this.write('WHOIS ' + target);
}

module.exports = function () {
    return function (irc) {
        var map = {};
        irc.whois = whois;
        irc.whoisCallbacks = {};

        irc.on('data', function (msg) {
            var params, target, cb, user;
            switch (msg.command) {
            case 'RPL_WHOISUSER':
                params = msg.params.split(' ');
                target = params[1];
                user = irc.getUser(target);

                map[target] = map[target] || {};
                map[target].nick = target;

                //reset to default values
                map[target].away = null;
                map[target].oper = false;
                map[target].account = null;
                map[target].registered = false;
                map[target].secure = false;

                map[target].username = params[2];
                user.username = params[2];

                map[target].hostname = params[3];
                user.hostname = params[3];

                map[target].realname = msg.trailing;
                user.realname = msg.trailing;
                break;
            case 'RPL_WHOISCHANNELS':
                params = msg.params.split(' ');
                target = params[1];
                user = irc.getUser(target);

                map[target] = map[target] || {};

                map[target].channels = {};
                msg.trailing.split(' ').forEach(function (channelName) {
                    var m = channelName.match(/^((!|~|&|@|%|\+)*)(.*)$/);
                    map[target].channels[m[3]] = m[1].split('');
                });
                user.channels = map[target].channels;
                break;
            case 'RPL_WHOISSERVER':
                params = msg.params.split(' ');
                target = params[1];
                user = irc.getUser(target);

                map[target] = map[target] || {};

                map[target].server = params[2];
                user.server = params[2];

                map[target].serverInfo = msg.trailing;
                user.serverInfo = msg.trailing;
                break;
            case 'RPL_AWAY':
                params = msg.params.split(' ');
                target = params[1];

                if (map[target]) {
                    user = irc.getUser(target);
                    user.away = msg.trailing;
                    map[target].away = msg.trailing;
                }
                break;
            case 'RPL_WHOISOPERATOR':
                params = msg.params.split(' ');
                target = params[1];
                user = irc.getUser(target);

                map[target] = map[target] || {};

                map[target].oper = true;
                user.oper = true;
                break;
            case 'RPL_WHOISIDLE':
                params = msg.params.split(' ');
                target = params[1];
                user = irc.getUser(target);

                map[target] = map[target] || {};

                map[target].idle = parseInt(params[2], 10);
                user.idle = parseInt(params[2], 10);

                map[target].signon = new Date(parseInt(params[3], 10) * 1000);
                user.signon = new Date(parseInt(params[3], 10) * 1000);
                break;
            case '330':
                params = msg.params.split(' ');
                target = params[1];
                user = irc.getUser(target);

                if (msg.trailing === 'is logged in as') {
                    map[target] = map[target] || {};
                    user.account = params[2];
                    map[target].account = params[2];
                }
                break;
            case '307':
                params = msg.params.split(' ');
                target = params[1];
                user = irc.getUser(target);

                if (msg.trailing === 'is a registered nick') {
                    map[target] = map[target] || {};
                    user.registered = true;
                    map[target].registered = true;
                }
                break;
            case '671':
                params = msg.params.split(' ');
                target = params[1];
                user = irc.getUser(target);

                if (msg.trailing === 'is using a secure connection') {
                    map[target] = map[target] || {};
                    user.secure = true;
                    map[target].secure = true;
                }
                break;
            case 'RPL_ENDOFWHOIS':
                params = msg.params.split(' ');
                target = params[1];
                if (!map[target]) {
                    return;
                }
                cb = irc.whoisCallbacks[target];
                if (cb) {
                    cb(null, map[target]);
                } else {
                    irc.emit('whois', null, map[target]);
                }
                break;
            case 'ERR_NEEDMOREPARAMS':
                params = msg.params.split(' ');
                target = params[1];
                if (target !== 'WHOIS') {
                    return;
                }
                cb = irc.whoisCallbacks[target];
                if (cb) {
                    cb('Not enough parameters', null);
                } else {
                    irc.emit('whois', 'Not enough parameters', null);
                }
                break;
            case 'ERR_NOSUCHSERVER':
                params = msg.params.split(' ');
                target = params[1];
                cb = irc.whoisCallbacks[target];
                if (cb) {
                    cb('No such server', null);
                } else {
                    irc.emit('whois', 'No such server', null);
                }
                break;
            case 'ERR_NOSUCHNICK':
                params = msg.params.split(' ');
                target = params[1];
                cb = irc.whoisCallbacks[target];
                if (cb) {
                    cb('No such nick/channel', null);
                } else {
                    irc.emit('whois', 'No such nick/channel', null);
                }
                break;
            }
        });
    };
};