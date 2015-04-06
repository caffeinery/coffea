/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('nick.js', function () {
    describe('on NICK', function () {
        it('should emit "nick"', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);

            client.once('nick', function () {
                client.once('nick', function (err, event) {
                    event.user.getNick().should.equal('bar');
                    event.oldNick.should.equal('foo');
                    client.me.getNick().should.equal('bar');
                    done();
                });
            });

            client.nick('foo');

            stream.write(':foo!bar@baz.com NICK bar\r\n');
        });
    });
    describe('on err_nicknameinuse', function () {
        it('should add _ to nick', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);
            client.nick('foo');
            stream.write(':irc.local 433 * foo :Nickname is already in use.\r\n');
            process.nextTick(function () {
                client.getUser().getNick().should.equal('foo_');
                stream.write(':irc.local 433 * foo :Nickname is already in use.\r\n');
                process.nextTick(function () {
                    client.getUser().getNick().should.equal('foo__');
                    done();
                });
            });
        });
    });
});
