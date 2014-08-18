/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.identify = function (username, password) {
            irc.on('welcome', function (event) {
                if (username === undefined) {
                	irc.send("NickServ", "IDENTIFY " + password, event.network);
                } else {
                	irc.send("NickServ", "IDENTIFY " + username + " " + password, event.network);
            	}
            });
        };
    };
};
