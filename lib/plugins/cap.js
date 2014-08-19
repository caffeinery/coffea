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

                irc.write("CAP REQ " + capabilities.join(" "), network, fn);
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
    };
};
