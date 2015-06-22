/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('..');
var Stream = require('stream').PassThrough;

describe('IRCv3 Parser', function() {
    describe('Message Tags', function () {
        it('should parse tags without values [single-tag]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test', st1_id);

            client.on("message", function (err, event) {
                event.tags.length.should.equal(1);
                event.tags[0].key.should.equal('aaa');
                done();
            });

            st1.write('@aaa :test!foo@bar.com PRIVMSG #test :hello world\r\n');
        });

        it('should parse tags without values [multi-tag]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test', st1_id);

            client.once("message", function (err, event) {
                event.tags.length.should.equal(2);
                event.tags[0].key.should.equal('aaa');
                event.tags[1].key.should.equal('bbb');
                done();
            });

            st1.write('@aaa;bbb :test!foo@bar.com PRIVMSG #test :hello world\r\n');
        });

        it('should parse tags with values [single-tag]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test', st1_id);

            client.once("message", function (err, event) {
                event.tags.length.should.equal(1);
                event.tags[0].key.should.equal('aaa');
                event.tags[0].value.should.equal('bbb');
                done();
            });

            st1.write('@aaa=bbb :test!foo@bar.com PRIVMSG #test :hello world\r\n');
        });

        it('should parse tags with values [multi-tag]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test', st1_id);

            client.once("message", function (err, event) {
                event.tags.length.should.equal(2);
                event.tags[0].key.should.equal('aaa');
                event.tags[0].value.should.equal('bbb');
                event.tags[1].key.should.equal('ccc');
                event.tags[1].value.should.equal('ddd');
                done();
            });

            st1.write('@aaa=bbb;ccc=ddd :test!foo@bar.com PRIVMSG #test :hello world\r\n');
        });

        it('should parse mixed tags', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test', st1_id);

            client.once("message", function (err, event) {
                event.tags.length.should.equal(3);
                event.tags[0].key.should.equal('aaa');
                event.tags[0].value.should.equal('bbb');
                event.tags[1].key.should.equal('ccc');
                event.tags[2].key.should.equal('znc.in/server-time');
                event.tags[2].value.should.equal('1434975029');
                done();
            });

            st1.write('@aaa=bbb;ccc;znc.in/server-time=1434975029 :test!foo@bar.com PRIVMSG #test :hello world\r\n');
        });
    });
});
