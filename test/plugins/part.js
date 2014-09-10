/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('part.js', function () {
    describe('on PART', function () {
        it('should emit "part"', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);
            client.nick('foo');

            client.on('part', function (event) {
                event.user.getNick().should.equal('foo');
                event.channels[0].getName().should.eql('#foo');
                event.channels[1].getName().should.eql('#bar');
                event.message.should.equal('So long!');
                done();
            });

            stream.write(':foo!bar@baz.com PART #foo,#bar :So long!\r\n');
        });
    });
});