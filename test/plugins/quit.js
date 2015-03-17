/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('quit.js', function () {
    describe('on QUIT', function () {
        it('should emit "quit"', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);
            client.nick('foo');

            client.on('quit', function (err, event) {
                event.user.getNick().should.equal('foo');
                event.message.should.eql('Remote host closed the connection');
                done();
            });

            stream.write(':foo!bar@baz.com QUIT :Remote host closed the connection\r\n');
        });
    });
    describe('client.quit()', function () {
        it('should emit "quit" aswell', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);
            client.nick('foo');

            client.on('quit', function (err, event) {
                event.user.getNick().should.equal('foo');
                event.message.should.eql('POOF');
                done();
            });

            // client.quit('POOF');
            stream.write(':foo!bar@baz.com QUIT :POOF\r\n');
        });
    });
});