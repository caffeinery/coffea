/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('whois.js', function () {
    describe('client.whois(target, fn)', function () {

        it('should parse user information', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);

            client.whois('nick', function (err, data) {
                if (err) {
                    return done(err);
                }
                data.nick.should.equal('nick');
                data.username.should.equal('user');
                data.hostname.should.equal('host.com');
                data.realname.should.equal('realname');
                done();
            });

            stream.write(':vulcanus.kerat.net 311 foo nick user host.com * :realname\r\n');
            stream.write(':vulcanus.kerat.net 318 foo nick :End of /WHOIS list.\r\n');
        });

        it('should parse channels (with modes)', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);

            client.whois('nick', function (err, data) {
                if (err) {
                    return done(err);
                }
                data.channels.should.be.an.instanceOf(Object).and.have.properties({
                    '#b0wm': [],
                    '#breadfish++': [],
                    '#dev': ['%'],
                    '#foreveralone': ['~'],
                    '#glados': [],
                    '#kerat': ['~'],
                    '#kerat-op': [],
                    '#kochstube': [],
                    '#pupskuchen': [],
                    '#sa-mp.de': ['~'],
                    '#zncbnc': ['~'],
                });
                done();
            });

            stream.write(':vulcanus.kerat.net 319 foo nick :~#kerat ~#zncbnc #kerat-op #b0wm %#dev #kochstube #glados #pupskuchen ~#foreveralone ~#sa-mp.de #breadfish++\r\n');
            stream.write(':vulcanus.kerat.net 318 foo nick :End of /WHOIS list.\r\n');
        });

        it('should parse server information', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);

            client.whois('nick', function (err, data) {
                if (err) {
                    return done(err);
                }
                data.server.should.equal('server.com');
                data.serverInfo.should.equal('Server Info');
                done();
            });

            stream.write(':vulcanus.kerat.net 312 foo nick server.com :Server Info\r\n');
            stream.write(':vulcanus.kerat.net 318 foo nick :End of /WHOIS list.\r\n');
        });

        it('should parse operator', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);

            client.whois('nick', function (err, data) {
                if (err) {
                    return done(err);
                }
                data.oper.should.equal(true);
                done();
            });

            stream.write(':vulcanus.kerat.net 313 foo nick :is a NetAdmin on KeratNet\r\n');
            stream.write(':vulcanus.kerat.net 318 foo nick :End of /WHOIS list.\r\n');
        });

        it('should parse account', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);

            client.whois('nick', function (err, data) {
                if (err) {
                    return done(err);
                }
                data.account.should.equal('Nick');
                done();
            });

            stream.write(':vulcanus.kerat.net 330 foo nick Nick :is logged in as\r\n');
            stream.write(':vulcanus.kerat.net 318 foo nick :End of /WHOIS list.\r\n');
        });

        it('should parse registered', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);

            client.whois('nick', function (err, data) {
                if (err) {
                    return done(err);
                }
                data.registered.should.equal(true);
                done();
            });

            stream.write(':vulcanus.kerat.net 307 foo nick :is a registered nick\r\n');
            stream.write(':vulcanus.kerat.net 318 foo nick :End of /WHOIS list.\r\n');
        });

        it('should parse secure connection', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);

            client.whois('nick', function (err, data) {
                if (err) {
                    return done(err);
                }
                data.secure.should.equal(true);
                done();
            });

            stream.write(':vulcanus.kerat.net 671 foo nick :is using a secure connection\r\n');
            stream.write(':vulcanus.kerat.net 318 foo nick :End of /WHOIS list.\r\n');
        });

        it('should parse secure connection', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);

            client.whois('nick', function (err, data) {
                if (err) {
                    return done(err);
                }
                data.idle.should.equal(1076);
                data.signon.should.be.an.instanceof(Date);
                data.signon.getTime().should.equal(1390235346 * 1000);
                done();
            });

            stream.write(':vulcanus.kerat.net 317 foo nick 1076 1390235346 :seconds idle, signon time\r\n');
            stream.write(':vulcanus.kerat.net 318 foo nick :End of /WHOIS list.\r\n');
        });

        it('should err with No such nick/channel', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);
            client.whois('unusednickorchannel');
            client.on('whois', function (err, event) {
                err.should.be.an.instanceof(Error);
                err.message.split(':')[0].should.equal('No such nick/channel');
                done();
            });
            stream.write(':vulcanus.kerat.net 401 maggin unusednickorchannel :No such nick/channel\r\n');
            stream.write(':vulcanus.kerat.net 318 maggin unusednickorchannel :End of /WHOIS list.\r\n');
        });

        it('should err with No such server', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);
            client.whois('not.a.valid.server', function (err) {
                err.split(':')[0].should.equal('No such server');
                done();
            });
            stream.write(':vulcanus.kerat.net 402 foo not.a.valid.server :No such server\r\n');
        });

        it('should err with Not enough parameters', function (done) {
            var stream = new Stream(),
                client = irc(stream, false);
            client.on('whois', function (err, event) {
                err.should.be.an.instanceof(Error);
                err.message.split(':')[0].should.equal('Not enough parameters');
                done();
            });
            stream.write(':vulcanus.kerat.net 461 foo WHOIS :Not enough parameters.\r\n');
        });
    });
});
