/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('privmsg.js', function () {
    describe('on PRIVMSG', function () {
        it('should emit "message"', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);
            client.nick('bar');

            client.on('message', function (err, event) {
                event.channel.getName().should.equal('#foo');
                event.user.getNick().should.equal('foo');
                event.message.should.equal('Hello World');
                event.isAction.should.equal(false);
                done();
            });
            stream.write(':foo!bar@baz.com PRIVMSG #foo :Hello World\r\n');
        });
        it('should emit "message" as action', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);
            client.nick('bar');

            client.on('message', function (err, event) {
                event.channel.getName().should.equal('#foo');
                event.user.getNick().should.equal('foo');
                event.message.should.equal('Hello World');
                event.isAction.should.equal(true);
                done();
            });
            stream.write(':foo!bar@baz.com PRIVMSG #foo :\u0001ACTION Hello World\u0001\r\n');
        });
        it('should emit "privatemessage"', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);
            client.nick('bar');

            client.on('privatemessage', function (err, event) {
                event.user.getNick().should.equal('foo');
                event.message.should.equal('Hello World');
                event.isAction.should.equal(false);
                done();
            });
            stream.write(':foo!bar@baz.com PRIVMSG bar :Hello World\r\n');
        });
        it('should emit "privatemessage" as action', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);
            client.nick('bar');

            client.on('privatemessage', function (err, event) {
                event.user.getNick().should.equal('foo');
                event.message.should.equal('Hello World');
                event.isAction.should.equal(true);
                done();
            });
            stream.write(':foo!bar@baz.com PRIVMSG bar :\u0001ACTION Hello World\u0001\r\n');
        });
    });
});