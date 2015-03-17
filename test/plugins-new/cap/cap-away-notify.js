/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../../..');
var Stream = require('stream').PassThrough;
var should = require('should');

describe('cap-away-notify.js', function() {
    describe('on AWAY', function() {
        it('should emit "away-notify"', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            client.once('away-notify', function (err, event) {
                event.user.getNick().should.equal('mike');
                event.message.should.equal('not here');
                done();
            });

            st1.write(':irc.server CAP * ACK :away-notify\r\n');
            st1.write(':mike!mike@wants.a.vhost.so.badly.he.would.suck.brendens.dick AWAY :not here\r\n');
        });
    });
});
