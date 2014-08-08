/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, stream_id) {
            if (msg.command === 'PING') {
                irc.write('PONG :' + msg.trailing);
                utils.emit(irc, stream_id, 'ping', {});
            }
        });
    };
};
