/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('whois.js', function () {
	describe('client.whois (target, network, fn)', function () {
		it('should parse basic infomation', function (done) {
			var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

			client.whois('foo', 0, function (err, data) {
				if (err) return done(err);

				data.nick.should.equal('foo');
				data.username.should.equal('bar');
				data.hostname.should.equal('baz.com');
				data.realname.should.equal('Foo B. Baz');
				done();
			});

			st1.write(':irc.local 311 me foo bar baz.com * :Foo B. Baz\r\n');
			st1.write(':irc.local 318 me foo :End of /WHOIS list.\r\n');
		});

		it('should parse channels and modes', function (done) {
			var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

			client.whois('foo', 0, function (err, data) {
				if (err) return done(err);

				data.channels.should.be.an.instanceOf(Object).and.have.properties({
					'#foo': ['@'],
					'#bar': ['%'],
					'#baz': ['~']
				});
				done();
			});

			st1.write(':irc.local 319 me foo :@#foo %#bar ~#baz\r\n');
			st1.write(':irc.local 318 me foo :End of /WHOIS list.\r\n');
		});

		it('should parse server information', function (done) {
			var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

			client.whois('foo', 0, function (err, data) {
				if (err) return done(err);

				data.server.should.equal('irc.local');
				data.serverInfo.should.equal('best server in the world');
				done();
			});

			st1.write(':irc.local 312 me foo irc.local :best server in the world\r\n');
			st1.write(':irc.local 318 me foo :End of /WHOIS list.\r\n');
		});

		it('should parse oper', function (done) {
			var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

			client.whois('foo', 0, function (err, data) {
				if (err) return done(err);

				data.oper.should.equal(true);
				done();
			});

			st1.write(':irc.local 313 me foo :is an IRC Operator\r\n');
			st1.write(':irc.local 318 me foo :End of /WHOIS list.\r\n');
		});

		it('should parse account', function (done) {
			var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

			client.whois('foo', 0, function (err, data) {
				if (err) return done(err);

				data.account.should.equal('foobar');
				done();
			});

			st1.write(':irc.local 330 me foo foobar :is logged in as\r\n');
			st1.write(':irc.local 318 me foo :End of /WHOIS list.\r\n');
		});

		it('should parse registered', function (done) {
			var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

			client.whois('foo', 0, function (err, data) {
				if (err) return done(err);

				data.registered.should.equal(true);
				done();
			});

			st1.write(':irc.local 307 me foo :is a registered nick\r\n');
			st1.write(':irc.local 318 me foo :End of /WHOIS list.\r\n');
		});

		it('should parse secure connection', function (done) {
			var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

			client.whois('foo', 0, function (err, data) {
				if (err) return done(err);

				data.secure.should.equal(true);
				done();
			});

			st1.write(':irc.local 671 me foo :is using a secure connection\r\n');
			st1.write(':irc.local 318 me foo :End of /WHOIS list.\r\n');
		});

		it('should parse idle time', function (done) {
			var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

			client.whois('foo', 0, function (err, data) {
				if (err) return done(err);

				data.idle.should.equal(600); // 10 minutes
				data.signon.should.be.an.instanceof(Date);
				data.signon.getTime().should.equal(1390235346 * 1000);
				done();
			});

			st1.write(':irc.local 317 me foo 600 1390235346 :seconds idle, signon time\r\n');
			st1.write(':irc.local 318 me foo :End of /WHOIS list.\r\n');
		});

		it('should error on No such nick/channel', function (done) {
			var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            client.whois('foo');
            client.on('whois', function (err, event) {
                err.should.be.an.instanceof(Error);
                err.message.split(':')[0].should.equal('No such nick/channel');
                done();
            });

			st1.write(':irc.local 401 me foo :No such nick/channel\r\n');
			st1.write(':irc.local 318 me foo :End of /WHOIS list.\r\n');
		});

		it('should error on No such server', function (done) {
			var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            client.whois('not.a.valid.server', function (err) {
                err.split(':')[0].should.equal('No such server');
                done();
            });

			st1.write(':irc.local 402 me not.a.valid.server :No such server\r\n');
		});

		it('should error on Not enough parameters', function (done) {
			var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            client.on('whois', function (err, event) {
                err.should.be.an.instanceof(Error);
                err.message.should.equal('Not enough parameters');
                done();
            });

			st1.write(':irc.local 461 me WHOIS :Not enough parameters.\r\n');
		});
	});
});