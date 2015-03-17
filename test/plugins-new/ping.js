/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('ping.js', function() {
	describe('on NOTICE', function() {
		it('should emit "ping" [single-network]', function (done) {
			var st1 = new Stream();
			var client = coffea(st1, false);

			client.on("ping", function (err, event) {
				done();
			});

			st1.write('PING :rothfuss.freenode.net\r\n');
		});

		it('should emit "ping" [multi-network]', function (done) {
			var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('foo', st1_id);
            client.nick('bar', st2_id);

			client.once("ping", function (err, event) {
				done();
			});

			st1.write('PING :rothfuss.freenode.net\r\n');
			st2.write('PING :kornbluth.freenode.net\r\n');
		});

		it('should emit "{network}:ping" [multi-network]', function (done) {
			var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('foo', st1_id);
            client.nick('bar', st2_id);

			var test = 0;
			client.on(st1_id + ":ping", function (err, event) {
				test++;
				if(test >= 2) {
					done();
				}
			});

			client.on(st2_id + ":ping", function (err, event) {
				test++;
				if(test >= 2) {
					done();
				}
			});

			st1.write('PING :rothfuss.freenode.net\r\n');
			st2.write('PING :kornbluth.freenode.net\r\n');
		});
	});
});
