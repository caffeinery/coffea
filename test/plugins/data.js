/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('data.js', function () {
    describe('on DATA', function () {
        it('should emit "data"', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);

            client.on('data', function (err, parsed) {
                parsed.prefix.should.equal('hitchcock.freenode.net');
                parsed.command.should.equal('NOTICE');
                parsed.params.should.equal('*');
                parsed.trailing.should.equal('*** Looking up your hostname...');
                parsed.string.should.equal(':hitchcock.freenode.net NOTICE * :*** Looking up your hostname...');
                done();
            });
            stream.write(':hitchcock.freenode.net NOTICE * :*** Looking up your hostname...\r\n');
        });
    });
});
