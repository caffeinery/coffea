/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('kick.js', function () {
    describe('on KICK', function () {
        it('should emit "kick"', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);
            client.nick('foo');

            client.on('kick', function (err, event) {
                event.channel.getName().should.equal('#foo');
                event.user.getNick().should.equal('targetnick');
                event.by.getNick().should.equal('foo');
                event.reason.should.equal('goodbye cruel world');
                done();
            });
            stream.write(':foo!bar@baz.com KICK #foo targetnick :goodbye cruel world\r\n');
        });
    });
});