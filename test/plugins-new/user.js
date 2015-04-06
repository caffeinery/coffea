/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('user.js', function() {
    describe('getUser()', function() {
        it('should return Channel object', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            var user = client.getUser('foo');
            user.getNick().should.equal('foo');
            done();
        });
    });
    describe('isUser()', function() {
        it('should return true if user', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            var user = client.getUser('foo');
            client.isUser(user).should.equal(true);
            done();
        });
        it('should return false', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            client.isUser(undefined).should.equal(false);
            done();
        });
    });
    describe('on DATA', function () {
        it('should set hostname', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('nick', st1_id);

            st1.write(':irc.net 396 nick host.com :is now your displayed host\r\n');
            process.nextTick(function() {
                client.networked_me[st1_id].getHostname().should.equal('host.com');
                done();
            });
        });
        it('should parse RPL_WHOREPLY', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('nick', st1_id);

            st1.write(':irc.net 352 nick #channel username host.com server.net nick H~@ :0 realname\r\n');
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
