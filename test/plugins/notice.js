/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('notice.js', function () {
    describe('on NOTICE', function () {
        it('should emit "notice"', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);

            client.on('notice', function (err, event) {
                event.from.getNick().should.equal('NickServ');
                event.to.should.equal('foo');
                event.message.should.equal('This nickname is registered. Please choose a different nickname, or identify via /msg NickServ identify <password>.');
                done();
            });

            stream.write(':NickServ!NickServ@services. NOTICE foo :This nickname is registered. Please choose a different nickname, or identify via /msg NickServ identify <password>.\r\n');
        });
    });
});