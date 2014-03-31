/*jslint node: true*/
/*global describe, it*/
"use strict";

var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('quit()', function () {
    describe('on QUIT', function () {
        it('should emit "quit"', function (done) {
            var stream = new Stream(),
                client = irc(stream);

            client.on('quit', function (event) {
                event.user.getNick().should.equal('foo');
                event.message.should.eql('Remote host closed the connection');
                done();
            });

            stream.write(':foo!bar@baz.com QUIT :Remote host closed the connection\r\n');
        });
    });
});