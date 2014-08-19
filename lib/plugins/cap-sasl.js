/*jslint node: true*/
"use strict";

module.exports = function () {
    return function (irc) {
        irc.sasl = {
            method: '',
            mechanism: function saslMechanism(mechanism, network, fn) {
                if (typeof network ===  'function') { // (fn)
                    fn = network;
                    network = '';
                }

                irc.sasl.method = mechanism;

                irc.write("AUTHENTICATE " + mechanism, network, fn);
            },
            login: function saslLogin(account, password, network, fn) {
                if (typeof network ===  'function') { // (fn)
                    fn = network;
                    network = '';
                }

                if (account === undefined && password === undefined) {
                    // User didnt use SASL but we need to still "auth"
                    irc.write("AUTHENTICATE *", network, fn);
                } else {
                    var data = new Buffer(account+'\u0000'+account+'\u0000'+password);

                    irc.write("AUTHENTICATE " + data.toString('base64'), network, fn);
                }
            }
        };
    };
};