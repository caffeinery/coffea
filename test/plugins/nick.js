/*jslint node: true*/
/*global describe, it*/
"use strict";

var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('nick()', function () {
    describe('on NICK', function () {

        it('should emit "nick"', function (done) {
            var stream = new Stream(),
                client = irc(stream);
            client.nick('foo');

            client.once('nick', function () {
                client.once('nick', function (event) {
                    event.user.getNick().should.equal('bar');
                    event.oldNick.should.equal('foo');
                    client.me.getNick().should.equal('bar');
                    done();
                });
            });

            stream.write(':foo!bar@baz.com NICK bar\r\n');
        });
    });
});