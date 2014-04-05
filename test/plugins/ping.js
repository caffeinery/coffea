/*jslint node: true*/
/*global describe, it*/
"use strict";

var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('ping.js', function () {
    describe('on PING', function () {
        it('should emit PING', function (done) {
            var stream = new Stream(),
                client = irc(stream);

            client.on('ping', function () {
                done();
            });

            stream.write('PING :rothfuss.freenode.net\r\n');
        });
    });
});