/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.cap = {
            ls: function capLs(network, fn) {
                if (typeof network ===  'function') { // (fn)
                    fn = network;
                    network = '';
                }

                irc.write("CAP LS");
            },
            list: function capList(network, fn) {
                if (typeof network ===  'function') { // (fn)
                    fn = network;
                    network = '';
                }

                irc.write("CAP LIST");
            },
            req: function capReq(capabilities, network, fn) {
                if (typeof network ===  'function') { // (capabilities, fn)
                    fn = network;
                    network = '';
                }
                capabilities = utils.toArray(capabilities);

                for(var capab in capabilities) {
                    irc.write("CAP REQ " + capabilities[capab], network, fn);
                }
            },
            clear: function capClear(network, fn) {
                if (typeof network ===  'function') { // (fn)
                    fn = network;
                    network = '';
                }

                irc.write("CAP CLEAR");
            },
            end: function capEnd(network, fn) {
                if (typeof network ===  'function') { // (fn)
                    fn = network;
                    network = '';
                }

                irc.write("CAP END");
            }
        };

        irc.on('data', function (msg, network) {
            if (msg.command === "CAP" && msg.params === "* LS") {
                utils.emit(irc, network, 'cap_list', {
                    'capabilities': msg.trailing.split(' ')
                });
            } else if (msg.command === "CAP" && msg.params === "* ACK") {
                utils.emit(irc, network, 'cap_ack' ,{
                    'capabilities': msg.trailing
                });
            } else if (msg.command === "CAP" && msg.params === "* NAK") {
                utils.emit(irc, network, 'cap_nak' ,{
                    'capabilities': msg.trailing
                });
            }
        });
    };
};
