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
            if (this.me === null) { this.me = {}; }
            this.me.username = username;
            this.me.realname = realname;
            this.write('USER ' + username + ' 0 * :' + realname, network, fn);
        };

        irc.oper = function ircOper(name, password, network, fn) {
            this.write('OPER ' + name + ' ' + password, network, fn);
        };
    };
};