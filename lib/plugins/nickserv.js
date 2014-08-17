/*jslint node: true*/
"use strict";

// var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.identify = function (username, password) {
            irc.on('welcome', function (event) {
                irc.send("NickServ", "IDENTIFY " + username + " " + password, event.network);
            });
        };
    };
};
