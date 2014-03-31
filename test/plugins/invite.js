/*jslint node: true*/
/*global describe, it*/
"use strict";

var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('motd()', function () {
    describe('on JOIN', function () {
        it('should emit "motd"', function (done) {
            var stream = new Stream(),
                client = irc(stream);

            client.on('invite', function (event) {
                event.user.getNick().should.equal('foo');
                event.target.getNick().should.equal('bar');
                event.channel.getName().should.equal('#foo');
                done();
            });
            stream.write(':foo!bar@baz.com INVITE bar :#foo\r\n');
        });
    });
});