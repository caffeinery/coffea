/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.notice = function ircNotice(target, msg, network, fn) {
            var parse = utils.parseTarget(target);
            if (!network) { network = parse.network; }
            if (!network) network = '0';
            target = parse.target;

            var _this = this;
            var leading = 'NOTICE ' + target + ' :';
            utils.stripMessage(leading, msg, this.networked_me[network], function (str) {
                _this.write(leading + str, network, fn);
            });
        };

        irc.on('data', function (err, msg) {
            var network = msg.network;
            if (msg.command === 'NOTICE') {
                utils.emit(irc, network, 'notice', {
                    "from": msg.prefix.indexOf('!') > -1 ? irc.getUser(utils.nick(msg), network) : msg.prefix,
                    "to": msg.params.toLowerCase(),
                    "message": msg.trailing,
                    "tags": msg.tags ? msg.tags : []
                });
            }
        });
    };
};
