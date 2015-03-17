/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('mode.js', function () {
    describe('on MODE', function () {
        it('should parse usermode', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);

            client.on('mode', function (err, event) {
                event.by.getNick().should.equal('foo');
                event.adding.should.equal(true);
                event.mode.should.equal('x');
                done();
            });
            stream.write(':foo!bar@baz.com MODE test +x\r\n');
        });
        it('should parse usermode aswell', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);

            client.once('mode', function (err, event) {
                event.by.should.equal('foo');
                event.adding.should.equal(true);
                event.mode.should.equal('Z');

                client.once('mode', function (err, event) {
                    event.by.should.equal('foo');
                    event.adding.should.equal(true);
                    event.mode.should.equal('i');
                    done();
                });
            });
            stream.write(':foo MODE foo :+Zi\r\n');
        });
        it('should parse channelmode', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);

            client.once('mode', function (err, event) {
                event.channel.getName().should.equal('#foo');
                event.by.getNick().should.equal('foo');
                event.argument.should.equal('bar');
                event.adding.should.equal(false);
                event.mode.should.equal('o');

                client.once('mode', function (err, event) {
                    event.channel.getName().should.equal('#foo');
                    event.by.getNick().should.equal('foo');
                    event.argument.should.equal('baz');
                    event.adding.should.equal(true);
                    event.mode.should.equal('v');

                    client.once('mode', function (err, event) {
                        event.channel.getName().should.equal('#foo');
                        event.by.getNick().should.equal('op');
                        event.argument.should.equal('badguy');
                        event.adding.should.equal(true);
                        event.mode.should.equal('b');
                        done();
                    });
                });
            });
            stream.write(':foo!bar@baz.com MODE #foo -o+v bar baz\r\n');
            stream.write(':op!bar@baz.com MODE #foo +b badguy\r\n');
        });
    });
});
