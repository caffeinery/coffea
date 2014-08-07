/*jslint node: true*/
/*global describe, it*/
"use strict";

var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('motd.js', function () {
    describe('on JOIN', function () {
        it('should emit "motd"', function (done) {
            var stream = new Stream(),
                client = irc(stream);

            client.on('motd', function (motd) {
                motd.motd[0].should.equal('vulcanus.kerat.net message of the day');
                motd.motd[1].should.equal('- THE CAKE IS A LIE');
                motd.motd[2].should.equal('End of message of the day.');
                done();
            });
            stream.write(':vulcanus.kerat.net 375 foo :vulcanus.kerat.net message of the day\r\n');
            stream.write(':vulcanus.kerat.net 372 foo :- THE CAKE IS A LIE\r\n');
            stream.write(':vulcanus.kerat.net 376 foo :End of message of the day.\r\n');
        });
    });
});