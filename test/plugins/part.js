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

            client.on('part', function (err, event) {
                event.user.getNick().should.equal('foo');
                event.channel.getName().should.eql('#foo');
                event.message.should.equal('So long!');
                done();
            });

            stream.write(':foo!bar@baz.com PART #foo :So long!\r\n');
        });
    });
});
