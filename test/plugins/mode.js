/*jslint node: true*/
/*global describe, it*/
"use strict";

var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('mode()', function () {
    describe('on MODE', function () {
        it('should parse usermode', function (done) {
            var stream = new Stream(),
                client = irc(stream);

            client.on('mode', function (event) {
                event.by.getNick().should.equal('foo');
                event.adding.should.equal(true);
                event.mode.should.equal('x');
                done();
            });
            stream.write(':foo!bar@baz.com MODE test +x\r\n');
        });
        it('should parse channelmode', function (done) {
            var stream = new Stream(),
                client = irc(stream);

            client.once('mode', function (event) {
                event.channel.getName().should.equal('#foo');
                event.by.getNick().should.equal('foo');
                event.argument.should.equal('bar');
                event.adding.should.equal(false);
                event.mode.should.equal('o');

                client.once('mode', function (event) {
                    event.channel.getName().should.equal('#foo');
                    event.by.getNick().should.equal('foo');
                    event.argument.should.equal('baz');
                    event.adding.should.equal(true);
                    event.mode.should.equal('v');
                    done();
                });
            });
            stream.write(':foo!bar@baz.com MODE #foo -o+v bar baz\r\n');
        });
    });
});