/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../../..');
var Stream = require('stream').PassThrough;
var should = require('should');

describe('cap.js', function() {
    describe('on JOIN', function() {
        it('should populate account and realname data', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            client.once('join', function (err, event) {
                event.user.getNick().should.equal('mike');
                event.channel.getName().should.equal('#test');
                event.account.should.equal('hyperdrive');
                event.realname.should.equal('Micheal Harker');
                done();
            });

            st1.write(':irc.server CAP * ACK :extended-join\r\n');
            st1.write(':mike!mike@wants.a.vhost.so.badly.he.would.suck.brendens.dick JOIN #test hyperdrive :Micheal Harker\r\n');
        });

        it('should not define account when not logged in', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            client.once('join', function (err, event) {
                event.user.getNick().should.equal('mike');
                event.channel.getName().should.equal('#test');
                should.not.exist(event.account);
                event.realname.should.equal('Micheal Harker');
                done();
            });

            st1.write(':irc.server CAP * ACK :extended-join\r\n');
            st1.write(':mike!mike@wants.a.vhost.so.badly.he.would.suck.brendens.dick JOIN #test * :Micheal Harker\r\n');
        });
    });
});
