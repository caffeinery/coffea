/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../../..');
var Stream = require('stream').PassThrough;
var should = require('should');

describe('cap-sasl.js', function() {
    describe('SASL support', function() {
        it('should send mechanism intent', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            client.once('data', function (data) {
                data.string.should.equal('AUTHENTICATE PLAIN');
                done();
            });

            client.sasl.mechanism('PLAIN');
        });

        it('should send AUTHENTICATE * when username and password not provided', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            client.once('data', function (data) {
                data.string.should.equal('AUTHENTICATE *');
                done();
            });

            client.sasl.login();
        });

        it('should send a base64 encoded string containing the username and password', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            client.once('data', function (data) {
                data.string.should.equal('AUTHENTICATE ' + new Buffer('accountname\u0000accountname\u0000password').toString('base64'));
                done();
            });

            client.sasl.login('accountname', 'password');
        });
    });
});
