/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('user.js', function () {
    describe('getUser()', function () {
        it('should return User object', function (done) {
            var stream = new Stream(),
                client = irc(stream, false),
                user = client.getUser('foo');

            user.getNick().should.equal('foo');
            done();
        });
        it('should return User object of bot', function (done) {
            var stream = new Stream(),
                client = irc(stream);

            client.nick('foo');

            client.getUser().getNick().should.equal('foo');
            done();
        });
    });
    describe('isUser()', function () {
        it('should return true', function (done) {
            var stream = new Stream(),
                client = irc(stream, false),
                user = client.getUser('foo');

            client.isUser(user).should.equal(true);
            done();
        });
        it('should return false', function (done) {
            var stream = new Stream(),
                client = irc(stream);

            client.isUser(undefined).should.equal(false);
            done();
        });
    });
    describe('on DATA', function () {
        it('should set hostname', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);
            client.nick('nick');

            stream.write(':vulcanus.kerat.net 396 nick host.com :is now your displayed host\r\n');
            process.nextTick(function () {
                client.me.getHostname().should.equal('host.com');
                done();
            });
        });
        it('should parse RPL_WHOREPLY', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);

            stream.write(':vulcanus.kerat.net 352 nick #channel username host.com server.net nick H~@ :0 realname\r\n');
            process.nextTick(function () {
                var user = client.getUser('nick');
                user.getUsername().should.equal('username');
                user.getHostname().should.equal('host.com');
                user.getServer().should.equal('server.net');
                user.getRealname().should.equal('realname');
                done();
            });
        });
    });
});
