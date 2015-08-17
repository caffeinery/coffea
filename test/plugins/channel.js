/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('channel.js', function () {
    describe('getChannel()', function () {
        it('should return Channel object', function (done) {
            var stream = new Stream(),
                client = irc(stream, false),
                channel = client.getChannel('#foo');

            channel.getName().should.equal('#foo');
            done();
        });
    });
    describe('isChannel()', function () {
        it('should return true', function (done) {
            var stream = new Stream(),
                client = irc(stream, false),
                channel = client.getChannel('#foo');

            client.isChannel(channel).should.equal(true);
            done();
        });
        it('should return false', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);

            client.isChannel(undefined).should.equal(false);
            done();
        });
    });
    describe('getChannelList(network)', function () {
        it('should return List of channels that we are in', function (done) {
            var stream = new Stream(),
                client = irc(stream, false),
                chanlist;
            client.nick('foo');


            stream.write(':foo!bar@baz.com JOIN :#foo\r\n');
            stream.write(':foo!bar@baz.com JOIN :#bar\r\n');
            stream.write(':foo!bar@baz.com JOIN :#baz\r\n');
            stream.write(':foo!bar@baz.com PART #bar :So long!\r\n');
            process.nextTick(function () {
                chanlist = client.getChannelList('0');
                chanlist.should.be.instanceof(Array).and.have.lengthOf(2);
                chanlist[0].should.equal('#foo');
                chanlist[1].should.equal('#baz');
                done();
            });
        });
    });
});