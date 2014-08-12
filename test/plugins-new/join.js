var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('join.js', function() {
	describe('on JOIN', function() {
		it('should emit "join" [single-network]', function (done) {
			var st1 = new Stream();
			var client = coffea(st1);

			client.on("join", function (event) {
				event.user.getNick().should.equal('foo');
				event.channel.should.equal('#baz');
				done();
			});

			st1.write(':foo!bar@baz.com JOIN :#baz\r\n');
		});

		it('should emit "join" [multi-network]', function (done) {
			var st1 = new Stream();
			var st2 = new Stream();
			var client = coffea(st1);
			client.useStream(st2);

			client.on("join", function (event) {
				if (event.network === 0) {
					event.user.getNick().should.equal('ChanServ');
					event.channel.should.equal('#servies');
				} else {
					event.user.getNick().should.equal('foo');
					event.channel.should.equal('#baz');
				}
				done();
			});

			st1.write(':ChanServ!ChanServ@services.in JOIN :#services\r\n');
			st1.write(':foo!bar@baz.com JOIN :#baz\r\n');
		});

		it('should emit "{network}:join" [multi-network]', function (done) {
			var st1 = new Stream();
			var st2 = new Stream();
			var client = coffea(st1);
			client.useStream(st2);

			client.on("0:join", function (event) {
				event.user.getNick().should.equal('ChanServ');
				event.channel.should.equal('#servies');
				done();
			});

			client.on("1:join", function (event) {
				event.user.getNick().should.equal('foo');
				event.channel.should.equal('#baz');
				done();
			});

			st1.write(':ChanServ!ChanServ@services.in JOIN :#services\r\n');
			st1.write(':foo!bar@baz.com JOIN :#baz\r\n');
		});
	});
});
