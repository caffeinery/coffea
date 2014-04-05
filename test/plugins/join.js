/*jslint node: true*/
/*global describe, it*/
"use strict";

var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('join.js', function () {
    describe('on JOIN', function () {
        it('should emit "join"', function (done) {
            var stream = new Stream(),
                client = irc(stream);
            client.nick('foo');

            client.on('join', function (event) {
                event.user.getNick().should.equal('foo');
                event.channel.getName().should.equal('#foo');
                done();
            });
            stream.write(':foo!bar@baz.com JOIN :#foo\r\n');
        });
    });
});