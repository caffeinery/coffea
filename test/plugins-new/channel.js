/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('channel.js', function() {
    describe('getChannel()', function() {
        it('should return Channel object', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            var channel = client.getChannel('#foo');
            channel.getName().should.equal('#foo');
            done();
        });
    });
    describe('isChannel()', function() {
        it('should return true if channel', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            var channel = client.getChannel('#foo');
            client.isChannel(channel).should.equal(true);
            done();
        });
        it('should return false', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            client.isChannel(undefined).should.equal(false);
            done();
        });
    });
    describe('getChannelList()', function () {
        it('should return list of all channels we\'re in', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            var chanlist;

            st1.write(':foo!bar@baz.com JOIN :#foo\r\n');
            st1.write(':foo!bar@baz.com JOIN :#bar\r\n');
            st1.write(':foo!bar@baz.com JOIN :#baz\r\n');
            st1.write(':foo!bar@baz.com PART #foo :This channel sucks!\r\n');
            process.nextTick(function() {
                chanlist = client.getChannellist();
                chanlist.should.be.instanceof(Array).and.have.lengthOf(2);
                chanlist[0].should.equal('#bar');
                chanlist[1].should.equal('#baz');
                done();
            });
        });
    });
});
