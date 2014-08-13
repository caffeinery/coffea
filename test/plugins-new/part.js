var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('part.js', function() {
	describe('on PART', function() {
		it('should emit "part" [single-network]', function (done) {
			var st1 = new Stream();
			var client = coffea(st1);

			client.on("part", function (event) {
				event.user.getNick().should.equal('foo');
                event.channels[0].getName().should.equal('#baz');
                event.channels[1].getName().should.equal('#bar');
                event.message.should.equal('Part');
				done();
			});

			st1.write(':foo!bar@baz.com PART #baz,#bar :Bye\r\n');
		});

		it('should emit "part" [multi-network]', function (done) {
			var st1 = new Stream();
			var st2 = new Stream();
			var client = coffea(st1);
			client.useStream(st2);

			client.on("part", function (event) {
				if (event.network === 0) {
					event.user.getNick().should.equal('ChanServ');
                	event.channels[0].getName().should.equal('#services');
                	event.message.should.equal(undefined);
				} else {
					event.user.getNick().should.equal('foo');
                	event.channels[0].getName().should.equal('#baz');
                	event.channels[1].getName().should.equal('#bar');
                	event.message.should.equal('Part');
				}
				done();
			});

			st1.write(':ChanServ!ChanServ@services.in PART #services\r\n');
			st2.write(':foo!bar@baz.com PART #baz,#bar :Bye\r\n');
		});

		it('should emit "{network}:part" [multi-network]', function (done) {
			var st1 = new Stream();
			var st2 = new Stream();
			var client = coffea(st1);
			client.useStream(st2);

			client.on("0:part", function (event) {
				event.user.getNick().should.equal('ChanServ');
                event.channels[0].getName().should.equal('#services');
                event.message.should.equal(undefined);
				done();
			});

			client.on("1:part", function (event) {
				event.user.getNick().should.equal('foo');
                event.channels[0].getName().should.equal('#baz');
                event.channels[1].getName().should.equal('#bar');
                event.message.should.equal('Part');
				done();
			});

			st1.write(':ChanServ!ChanServ@services.in PART #services\r\n');
			st2.write(':foo!bar@baz.com PART #baz,#bar :Bye\r\n');
		});
	});
});
