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

                irc.on('cap_ack', function (event) {
                    if(event.capabilities === 'sasl') {
                        // Send method/mechanism
                        irc.write("AUTHENTICATE " + mechanism, network, fn);
                    }
                });
            },
            login: function saslLogin(account, password, network, fn) {
                if (typeof network ===  'function') { // (fn)
                    fn = network;
                    network = '';
                }

                irc.on('data', function(msg, network) {
                    if(msg.command === 'AUTHENTICATE' && msg.params === '+' && irc.sasl.method === "PLAIN") {
                        // Send our PLAIN password now!
                        if (account === undefined && password === undefined) {
                            // User didnt use SASL but we need to still "auth"
                            irc.write("AUTHENTICATE +", network, fn);
                        } else {
                            var data = new Buffer(account+'\u0000'+account+'\u0000'+password).toString('base64');

                            irc.write("AUTHENTICATE "+data, network, fn);
                        }
                    }
                });
            }
        };
    };
};