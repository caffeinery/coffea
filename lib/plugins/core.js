/*jslint node: true*/
"use strict";

// var utils = require('../utils');

/**
 * Core functions plugin.
 *
 * @return {Function}
 * @api public
 */
module.exports = function () {
    return function (irc) {
        // TODO: maybe we should put these into other plugins too?
        irc.pass = function ircPass(pass, network, fn) {
            this.write('PASS ' + pass, network, fn);
        };

        irc.user = function ircUser(username, realname, network, fn) {
            if (!network) network = '0';
            if (!irc.networked_me) irc.networked_me = {};
            if (!irc.networked_me[network]) irc.networked_me[network] = {};
            irc.me = irc.networked_me[network]; // fallback
            this.networked_me[network].username = username;
            this.networked_me[network].realname = realname;
            this.write('USER ' + username + ' 0 * :' + realname, network, fn);
        };

        irc.oper = function ircOper(name, password, network, fn) {
            this.write('OPER ' + name + ' ' + password, network, fn);
        };
    };
};
