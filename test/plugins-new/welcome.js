/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('welcome.js', function() {
	describe('on TOPIC', function() {
        it('should set client.me to the users object', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            st1.write(':vulcanus.kerat.net 001 foo :Welcome to the KeratNet IRC Network foo!bar@baz.com\r\n');

            process.nextTick(function () {
                client.networked_me[st1_id].getNick().should.equal('foo');
                done();
            });
        });

		it('should emit "welcome" [single-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

			client.once("welcome", function (err, event) {
				event.nick.should.equal('foo');
                event.message.should.equal('Welcome to the KeratNet IRC Network foo!bar@baz.com');
                done();
			});

            st1.write(':vulcanus.kerat.net 001 foo :Welcome to the KeratNet IRC Network foo!bar@baz.com\r\n');
		});

		it('should emit "welcome" [multi-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('foo', st1_id);
            client.nick('bar', st2_id);

			client.once("welcome", function (err, event) {
				if (event.network === st1_id) {
					event.nick.should.equal('foo');
                    event.message.should.equal('Welcome to the KeratNet IRC Network foo!bar@baz.com');
				} else {
					event.nick.should.equal('bar');
                    event.message.should.equal('Welcome to the freenode IRC Network bar!foo@baz.com');
				}
				done();
			});

			st1.write(':vulcanus.kerat.net 001 foo :Welcome to the KeratNet IRC Network foo!bar@baz.com\r\n');
			st2.write(':vulcanus.kerat.net 001 bar :Welcome to the freenode IRC Network bar!foo@baz.com\r\n');
		});

		it('should emit "{network}:welcome" [multi-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('foo', st1_id);
            client.nick('bar', st2_id);

            var tests = 0;
			client.once(st1_id + ":welcome", function (err, event) {
				event.nick.should.equal('foo');
                event.message.should.equal('Welcome to the KeratNet IRC Network foo!bar@baz.com');
				tests++;
                if(tests >= 2) {
                    done();
                }
			});

			client.once(st2_id + ":welcome", function (err, event) {
				event.nick.should.equal('bar');
                event.message.should.equal('Welcome to the freenode IRC Network bar!foo@baz.com');
				tests++;
                if(tests >= 2) {
                    done();
                }
			});

			st1.write(':vulcanus.kerat.net 001 foo :Welcome to the KeratNet IRC Network foo!bar@baz.com\r\n');
            st2.write(':vulcanus.kerat.net 001 bar :Welcome to the freenode IRC Network bar!foo@baz.com\r\n');
		});
	});
});
