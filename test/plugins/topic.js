/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('topic.js', function () {
    describe('on TOPIC', function () {
        it('should emit "topic"', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);

            client.on('topic', function (err, event) {
                event.channel.getName().should.equal('#foo');
                event.topic.should.equal('HOT TOPIC');
                event.user.getNick().should.equal('foo');
                event.time.should.be.an.instanceof(Date);
                event.time.getTime().should.equal(1391341086 * 1000);
                event.changed.should.equal(false);
                done();
            });

            stream.write(':vulcanus.kerat.net 332 bar #foo :HOT TOPIC\r\n');
            stream.write(':vulcanus.kerat.net 333 bar #foo foo!bar@baz.com 1391341086\r\n');
        });

        it('should emit "topic" changed', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);

            client.on('topic', function (err, event) {
                event.channel.getName().should.equal('#foo');
                event.topic.should.equal('HOT TOPIC');
                event.user.getNick().should.equal('foo');
                event.time.should.be.an.instanceof(Date);
                event.time.getTime().should.be.within(new Date().getTime() - 10, new Date().getTime() + 10);//~ now
                event.changed.should.equal(true);
                done();
            });

            stream.write(':foo!bar@baz.com TOPIC #foo :HOT TOPIC\r\n');
        });
    });
});