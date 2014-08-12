var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('ping.js', function() {
	describe('on NOTICE', function() {
		it('should emit "ping" [single-network]', function (done) {
			var st1 = new Stream();
			var client = coffea(st1);

			client.on("ping", function (event) {
				done();
			});

			st1.write('PING :rothfuss.freenode.net\r\n');
		});

		it('should emit "ping" [multi-network]', function (done) {
			var st1 = new Stream();
			var st2 = new Stream();
			var client = coffea(st1);
			client.useStream(st2);

			client.on("ping", function (event) {
				done();
			});

			st1.write('PING :rothfuss.freenode.net\r\n');
			st2.write('PING :kornbluth.freenode.net\r\n');
		});

		it('should emit "{network}:ping" [multi-network]', function (done) {
			var st1 = new Stream();
			var st2 = new Stream();
			var client = coffea(st1);
			client.useStream(st2);

			client.on("0:ping", function (event) {
				done();
			});

			client.on("1:ping", function (event) {
				done();
			});

			st1.write('PING :rothfuss.freenode.net\r\n');
			st2.write('PING :kornbluth.freenode.net\r\n');
		});
	});
});
