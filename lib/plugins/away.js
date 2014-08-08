/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, stream_id) {
            if (msg.command === 'RPL_AWAY') {
                utils.emit(irc, stream_id, 'away', {
                    "user": irc.getUser(msg.params.split(' ')[1]),
                    "message": msg.trailing
                });
            }
        });
    };
};
