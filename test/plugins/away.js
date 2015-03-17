/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('away.js', function () {
    describe('on RPL_AWAY', function () {
        it('should emit "away"', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);
            client.nick('mynick');

            client.on('away', function (err, event) {
                event.user.getNick().should.equal('targetnick');
                event.message.should.equal('nope');
                done();
            });

            stream.write(':irc.local 301 mynick targetnick :nope\r\n');
        });
    });
});
