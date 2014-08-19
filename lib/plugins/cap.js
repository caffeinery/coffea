/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.capLs = function capLs(network, fn) {
            if (typeof network ===  'function') { // (fn)
                fn = network;
                network = '';
            }

            irc.write("CAP LS", network, fn);
        };

        irc.capList = function capList(network, fn) {
            if (typeof network ===  'function') { // (fn)
                fn = network;
                network = '';
            }

            irc.write("CAP LIST", network, fn);
        };

        irc.capReq = function capReq(capabilities, network, fn) {
            if (typeof network ===  'function') { // (capabilities, fn)
                fn = network;
                network = '';
            }
            capabilities = utils.toArray(capabilities);

            for(var capab in capabilities) {
                if (capabilities.hasOwnProperty(capab)) {
                    irc.write("CAP REQ " + capabilities[capab], network, fn);
                }
            }
        };

        irc.capClear = function capClear(network, fn) {
            if (typeof network ===  'function') { // (fn)
                fn = network;
                network = '';
            }

            irc.write("CAP CLEAR", network, fn);
            irc.capabilities = [];
        };

        irc.capEnd = function capEnd(network, fn) {
            if (typeof network ===  'function') { // (fn)
                fn = network;
                network = '';
            }

            irc.write("CAP END", network, fn);
        };

        irc.on('data', function (msg, network) {
            if (msg.command === "CAP" && msg.params === "* LS") {
                utils.emit(irc, network, 'cap_list', {
                    'capabilities': msg.trailing.split(' ')
                });
            } else if (msg.command === "CAP" && msg.params.split(" ")[1] === "ACK") {
                utils.emit(irc, network, 'cap_ack' ,{
                    'capabilities': msg.trailing
                });
                irc.capabilities.push(msg.trailing);
            } else if (msg.command === "CAP" && msg.params.split(" ")[1] === "NAK") {
                utils.emit(irc, network, 'cap_nak' ,{
                    'capabilities': msg.trailing
                });
            }
        });
    };
};
