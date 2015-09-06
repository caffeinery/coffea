/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('server.js', function () {
    describe('getServerInfo()', function () {
        it('should parse RPL_YOURHOST', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);

            stream.write(':irc.local 002 foo :Your host is irc.local, running version InspIRCd-2.0\r\n');
            process.nextTick(function () {
                var svrInfo = client.getServerInfo();
                svrInfo.servername.should.equal('irc.local');
                svrInfo.version.should.equal('InspIRCd-2.0');
                done();
            });
        });
        it('should parse RPL_CREATED', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);

            stream.write(':irc.local 003 foo :This server was created 16:48:26 Jan 20 2014\r\n');
            process.nextTick(function () {
                var svrInfo = client.getServerInfo();
                svrInfo.created.should.be.an.instanceof(Date);
                svrInfo.created.getTime().should.equal(new Date('16:48:26 Jan 20 2014').getTime());
                done();
            });
        });
    });
});
