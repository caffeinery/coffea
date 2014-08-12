var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('away.js', function() {
	describe('on RPL_AWAY', function() {
		it('should emit "away" [single-network]', function (done) {
			var st1 = new Stream();
			var client = coffea(st1);

			client.on("away", function (event) {
				event.user.getNick().should.equal('you');
				event.message.should.equal('not here');
				done();
			});

			st1.write(':irc.local 301 me you :not here\r\n');
		});

		it('should emit "away" [multi-network]', function (done) {
			var st1 = new Stream();
			var st2 = new Stream();
			var client = coffea(st1);
			client.useStream(st2);

			client.on("away", function (event) {
				event.network.should.equal(1);
				event.user.getNick().should.equal('you');
				event.message.should.equal('not here');
				done();
			});

			st1.write(':you!are@so.cool.com PRIVMSG #test :afk\r\n');
			st2.write(':irc.local 301 me you :not here\r\n');
		});

		it('should emit "{network}:away" [multi-network]', function (done) {
			var st1 = new Stream();
			var st2 = new Stream();
			var client = coffea(st1);
			client.useStream(st2);

			client.on("0:away", function (event) {
				event.network.should.equal(0);
				event.user.getNick().should.equal('you');
				event.message.should.equal('not here');
				done();
			});

			st2.write(':you!are@so.cool.com PRIVMSG #test :afk\r\n');
			st1.write(':irc.local 301 me you :not here\r\n');
		});
	});
});
