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
        it('should parse RPL_ISUPPORT', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);

            stream.write(':irc.local 005 foo AWAYLEN=200 CALLERID=g CASEMAPPING=rfc1459 CHANMODES=beg,k,FJLfjl,ABMRScimnprstz CHANNELLEN=64 CHANTYPES=# CHARSET=ascii ELIST=MU EXCEPTS=e EXTBAN=,ABRSUcpz FNC KICKLEN=255 MAP :are supported by this server\r\n');
            stream.write(':irc.local 005 foo MAXBANS=60 MAXCHANNELS=20 MAXPARA=32 MAXTARGETS=20 MODES=20 NAMESX NETWORK=LocalIRC NICKLEN=31 OPERLOG PREFIX=(Yqaohv)!~&@%+ SSL=[2a03:4000:2:109::4:36]:6697 STARTTLS STATUSMSG=!~&@%+ :are supported by this server\r\n');
            stream.write(':irc.local 005 foo TOPICLEN=307 UHNAMES VBANLIST WALLCHOPS WALLVOICES :are supported by this server\r\n');
            process.nextTick(function () {
                var svrInfo = client.getServerInfo();
                (svrInfo.supports.foo === undefined).should.equal(true);
                svrInfo.supports.AWAYLEN.should.equal('200');
                svrInfo.supports.CALLERID.should.equal('g');
                svrInfo.supports.CASEMAPPING.should.equal('rfc1459');
                svrInfo.supports.CHANMODES.should.equal('beg,k,FJLfjl,ABMRScimnprstz');
                svrInfo.supports.CHANNELLEN.should.equal('64');
                svrInfo.supports.CHANTYPES.should.equal('#');
                svrInfo.supports.CHARSET.should.equal('ascii');
                svrInfo.supports.ELIST.should.equal('MU');
                svrInfo.supports.EXCEPTS.should.equal('e');
                svrInfo.supports.EXTBAN.should.equal(',ABRSUcpz');
                svrInfo.supports.FNC.should.equal(true);
                svrInfo.supports.KICKLEN.should.equal('255');

                svrInfo.supports.MAXBANS.should.equal('60');
                svrInfo.supports.MAXCHANNELS.should.equal('20');
                svrInfo.supports.MAXPARA.should.equal('32');
                svrInfo.supports.MAXTARGETS.should.equal('20');
                svrInfo.supports.MODES.should.equal('20');
                svrInfo.supports.NAMESX.should.equal(true);
                svrInfo.supports.NETWORK.should.equal('LocalIRC');
                svrInfo.supports.NICKLEN.should.equal('31');
                svrInfo.supports.OPERLOG.should.equal(true);
                svrInfo.supports.PREFIX.should.equal('(Yqaohv)!~&@%+');
                svrInfo.supports.STARTTLS.should.equal(true);
                svrInfo.supports.STATUSMSG.should.equal('!~&@%+');

                svrInfo.supports.TOPICLEN.should.equal('307');
                svrInfo.supports.UHNAMES.should.equal(true);
                svrInfo.supports.VBANLIST.should.equal(true);
                svrInfo.supports.WALLCHOPS.should.equal(true);
                svrInfo.supports.WALLVOICES.should.equal(true);
                done();
            });
        });
    });
});
