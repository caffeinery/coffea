/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../../..');
var Stream = require('stream').PassThrough;

describe('cap.js', function() {
    describe('on LS', function() {
        it('should emit "cap_list"', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            client.once("cap_list", function (err, event) {
                event.capabilities.should.eql(['away-notify', 'account-notify', 'sasl']);
                done();
            });

            st1.write(':irc.server CAP * LS :away-notify account-notify sasl\r\n');
        });
    });

    describe('on NAK', function() {
        it('should emit "cap_nak"', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            client.once("cap_nak", function (err, event) {
                event.capabilities.should.equal('fjefje');
                done();
            });

            st1.write(':irc.server CAP * NAK :fjefje\r\n');
        });
    });

    describe('on ACK', function() {
        it('should emit "cap_ack"', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            client.once("cap_ack", function (err, event) {
                event.capabilities.should.equal('sasl');
                done();
            });

            st1.write(':irc.server CAP * ACK :sasl\r\n');
        });

        it('should add to capability list', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            st1.write(':irc.server CAP * ACK :sasl\r\n');

            process.nextTick(function () {
                client.capabilities.should.eql(['sasl']);
                done();
            });
        });
    });
});
