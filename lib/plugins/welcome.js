/*jslint node: true*/
"use strict";

var utils = require("../utils");

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, stream_id) {
            if (msg.command === 'RPL_WELCOME') {
                irc.me.nick = msg.params;
                utils.emit(irc, stream_id, 'welcome', {
                    "nick": msg.params,
                    "message": msg.trailing
                });

                // irc.emit('welcome', {
                //     "nick": msg.params,
                //     "message": msg.trailing,
                //     "network": stream_id
                // });
            }
        });
    };
};
