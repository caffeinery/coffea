/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.on('data', function (msg, stream_id) {
            if (msg.command === 'NOTICE') {
                utils.emit(irc, stream_id, 'notice', {
                    "from": msg.prefix.indexOf('!') > -1 ? irc.getUser(utils.nick(msg)) : msg.prefix,
                    "to": msg.params.toLowerCase(),
                    "message": msg.trailing
                });

                // irc.emit('notice', {
                //     "from": msg.prefix.indexOf('!') > -1 ? irc.getUser(utils.nick(msg)) : msg.prefix,
                //     "to": msg.params.toLowerCase(),
                //     "message": msg.trailing,
                //     "network": stream_id
                // });
            }
        });
    };
};
