/*jslint node: true*/
"use strict";

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, network) {
            if (msg.command === 'RPL_WELCOME') {
                irc.me.nick = msg.params;
                irc.emit('welcome', {
                    "nick": msg.params,
                    "message": msg.trailing,
                    "network": network
                });
            }
        });
    };
};
