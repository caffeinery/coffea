/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('welcome.js', function () {
    describe('on RPL_WELCOME', function () {
        it('should set client.me to the users object', function () {
            var stream = new Stream(),
                client = irc(stream, false);
            client.nick('foo');

            stream.write(':vulcanus.kerat.net 001 foo :Welcome to the KeratNet IRC Network foo!bar@baz.com\r\n');
            process.nextTick(function () {
                client.me.getNick().should.equal('foo');
            });
        });

        it('should emit "welcome"', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);
            client.nick('foo');

            client.on('welcome', function (err, event) {
                event.nick.should.equal('foo');
                event.message.should.equal('Welcome to the KeratNet IRC Network foo!bar@baz.com');
                done();
            });

            stream.write(':vulcanus.kerat.net 001 foo :Welcome to the KeratNet IRC Network foo!bar@baz.com\r\n');
        });
    });
});
