/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('motd.js', function () {
    describe('on JOIN', function () {
        it('should emit "motd"', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);

            client.on('motd', function (err, event) {
                event.motd[0].should.equal('irc.local message of the day');
                event.motd[1].should.equal('- THE CAKE IS A LIE');
                event.motd[2].should.equal('End of message of the day.');
                done();
            });
            stream.write(':irc.local 375 foo :irc.local message of the day\r\n');
            stream.write(':irc.local 372 foo :- THE CAKE IS A LIE\r\n');
            stream.write(':irc.local 376 foo :End of message of the day.\r\n');
        });
    });
});
