var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('quit.js', function() {
	describe('on PART', function() {
		it('should emit "quit" [single-network]', function (done) {
			var st1 = new Stream();
			var client = coffea(st1);

			client.on("quit", function (event) {
				event.user.getNick().should.equal('foo');
                event.channels[0].getName().should.equal('#baz');
                event.channels[1].getName().should.equal('#bar');
                event.message.should.equal('Part');
				done();
			});

			st1.write(':foo!bar@baz.com QUIT :Client Quit\r\n');
		});

		it('should emit "quit" [multi-network]', function (done) {
			var st1 = new Stream();
			var st2 = new Stream();
			var client = coffea(st1);
			client.useStream(st2);

			client.on("quit", function (event) {
				if (event.network === 0) {
					event.user.getNick().should.equal('ChanServ');
                	event.channels[0].getName().should.equal('#baz');
                	event.channels[1].getName().should.equal('#bar');
                	event.message.should.equal(undefined);
				} else {
					event.user.getNick().should.equal('foo');
                	event.channels[0].getName().should.equal('#baz');
                	event.channels[1].getName().should.equal('#bar');
                	event.message.should.equal('Part');
				}
				done();
			});

			st1.write(':ChanServ!ChanServ@services.in QUIT :shutting down\r\n');
			st2.write(':foo!bar@baz.com PART :Client Quit\r\n');
		});

		it('should emit "{network}:quit" [multi-network]', function (done) {
			var st1 = new Stream();
			var st2 = new Stream();
			var client = coffea(st1);
			client.useStream(st2);

			client.on("0:quit", function (event) {
				event.user.getNick().should.equal('ChanServ');
                event.channels[0].getName().should.equal('#baz');
                event.channels[1].getName().should.equal('#bar');
                event.message.should.equal(undefined);
				done();
			});

			client.on("1:quit", function (event) {
				event.user.getNick().should.equal('foo');
                event.channels[0].getName().should.equal('#baz');
                event.channels[1].getName().should.equal('#bar');
                event.message.should.equal('Part');
				done();
			});

			st1.write(':ChanServ!ChanServ@services.in PART :shutting down\r\n');
			st2.write(':foo!bar@baz.com PART :Client Quit\r\n');
		});
	});
});
