/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../../..');
var Stream = require('stream').PassThrough;
var should = require('should');

describe('cap-account-notify.js', function() {
    describe('on ACCOUNT', function() {
        it('should emit "account-login"', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            client.once('account-login', function (err, event) {
                event.user.getNick().should.equal('mike');
                event.account.should.equal('hyperdrive');
                done();
            });

            st1.write(':irc.server CAP * ACK :account-notify\r\n');
            st1.write(':mike!mike@wants.a.vhost.so.badly.he.would.suck.brendens.dick ACCOUNT hyperdrive\r\n');
        });

        it('should shouldnt define account if logged out', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            client.once('account-login', function (err, event) {
                event.user.getNick().should.equal('mike');
                should.not.exist(event.account);
                done();
            });

            st1.write(':irc.server CAP * ACK :account-notify\r\n');
            st1.write(':mike!mike@wants.a.vhost.so.badly.he.would.suck.brendens.dick ACCOUNT *\r\n');
        });
    });
});
