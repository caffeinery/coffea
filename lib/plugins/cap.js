/*jslint node: true*/
"use strict";

var utils = require('../utils');

module.exports = function () {
    return function (irc) {
        irc.sendCapabilities = function sendCapabilities(network) {
            irc.once('cap_list', function (event) {
                irc.cap.req(['account-notify', 'extended-join']);

                irc.cap.end();
            });

            irc.cap.ls();
        };
        irc.cap = {
            ls: function capLs(network, fn) {
                if (typeof network ===  'function') { // (fn)
                    fn = network;
                    network = '';
                }

                irc.write("CAP LS", network, fn);
            },
            list: function capList(network, fn) {
                if (typeof network ===  'function') { // (fn)
                    fn = network;
                    network = '';
                }

                irc.write("CAP LIST", network, fn);
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

                irc.write("CAP CLEAR", network, fn);
                irc.capabilities = [];
            },
            end: function capEnd(network, fn) {
                if (typeof network ===  'function') { // (fn)
                    fn = network;
                    network = '';
                }

                irc.write("CAP END", network, fn);
            }
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
                console.log(irc.capabilities);
            } else if (msg.command === "CAP" && msg.params.split(" ")[1] === "NAK") {
                utils.emit(irc, network, 'cap_nak' ,{
                    'capabilities': msg.trailing
                });
            }
        });
    };
};
