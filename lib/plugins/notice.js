/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.notice = function ircNotice(target, msg, network, fn) {
            var parse = utils.parseTarget(target);
            if (!network) { network = parse.network; }
            target = parse.target;

            var leading, maxlen, _this, message, args = Array.prototype.slice.call(arguments);
            args.shift();
            message = args.join(' ');

            _this = this;
            leading = 'NOTICE ' + target + ' :';
            maxlen = 512 -
                    (1 + this.me.getNick().length + 1 + this.me.getUsername().length + 1 + this.me.getHostname().length + 1) - 
                    leading.length - 2;
            /*jslint regexp: true*/
            message.match(new RegExp('.{1,' + maxlen + '}', 'g')).forEach(function (str) {
                if (str[0] === ' ') { //leading whitespace
                    str = str.substring(1);
                }
                if (str[str.length - 1] === ' ') { //trailing whitespace
                    str = str.substring(0, str.length - 1);
                }
                _this.write(leading + str, network, fn);
            });
            /*jslint regexp: false*/
        };
        
        irc.on('data', function (msg, network) {
            if (msg.command === 'NOTICE') {
                utils.emit(irc, network, 'notice', {
                    "from": msg.prefix.indexOf('!') > -1 ? irc.getUser(utils.nick(msg), network) : msg.prefix,
                    "to": msg.params.toLowerCase(),
                    "message": msg.trailing
                });
            }
        });
    };
};
