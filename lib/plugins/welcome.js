/*jslint node: true*/
"use strict";

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, stream_id) {
            if (msg.command === 'RPL_WELCOME') {
                irc.me.nick = msg.params;
                irc.emit('welcome', {
                    "nick": msg.params,
                    "message": msg.trailing,
                    "network": stream_id
                });
            }
        });
    };
};
