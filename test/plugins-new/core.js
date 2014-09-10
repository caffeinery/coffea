/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('core.js', function() {
    describe('client.pass()', function () {
        it('should send the server password', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PASS test');
                    done();
                });
            });

            client.nick('test');
            client.pass('test');
        });
    });

    describe('client.user()', function () {
        it('should send the right parameters', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('USER test2 0 * :Testing Client');
                    done();
                });
            });

            client.nick('test');
            client.user('test2', 'Testing Client');
        });
    });

    describe('client.oper()', function () {
        it('should send the right parameters', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('OPER test password');
                    done();
                });
            });

            client.nick('test');
            client.oper('test', 'password');
        });
    });
});
