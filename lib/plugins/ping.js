/*jslint node: true*/
"use strict";

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, stream_id) {
            if (msg.command === 'PING') {
                irc.write('PONG :' + msg.trailing);
                irc.emit('ping', stream_id);
            }
        });
    };
};
