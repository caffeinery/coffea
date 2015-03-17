/*jslint node: true*/
"use strict";

// var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.identify = function (username, password, network, fn) {
            if (typeof network === 'function') {
              fn = network;
              network = undefined;
            }

            if (irc.welcomed) {
                // we are already online, send immediately
                if (fn && !network) {
                    fn(new Error('Network not specified.'));
                } else {
                    if (username) {
                        irc.send("NickServ", "IDENTIFY " + username + " " + password, network, fn);
                    } else {
                        irc.send("NickServ", "IDENTIFY " + password, network, fn);
                    }
                }
            } else {
                // wait until we are online, then send ns identify
                irc.on('welcome', function (err, event) {
                    if (username) {
                        irc.send("NickServ", "IDENTIFY " + username + " " + password, network ? network : event.network, fn);
                    } else {
                        irc.send("NickServ", "IDENTIFY " + password, network ? network : event.network, fn);
                    }
                });
            }
        };
    };
};
