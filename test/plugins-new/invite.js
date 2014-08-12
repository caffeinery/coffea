var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('invite.js', function() {
	describe('on INVITE', function() {
		it('should emit "invite" [single-network]', function (done) {
			var st1 = new Stream();
			var client = coffea(st1);

			client.on("invite", function (event) {
				event.user.getNick().should.equal('you');
				event.target.getNick().should.equal('me');
				event.channel.should.equal('#test');
				done();
			});

			st1.write(':you!are@so.cool.com INVITE me :#test\r\n');
		});

		it('should emit "invite" [multi-network]', function (done) {
			var st1 = new Stream();
			var st2 = new Stream();
			var client = coffea(st1);
			client.useStream(st2);

			client.on("invite", function (event) {
				if (event.network === 0) {
					event.user.getNick().should.equal('you');
					event.target.getNick().should.equal('me');
					event.channel.should.equal('#test');
				} else {
					event.user.getNick().should.equal('xddjshali');
					event.target.getNick().should.equal('you');
					event.channel.should.equal('#random');
				}
				done();
			});

			st1.write(':you!are@so.cool.com INVITE me :#test\r\n');
			st2.write(':xddjshali!i@make.no.sense INVITE you :#random\r\n');
		});

		it('should emit "{network}:invite" [multi-network]', function (done) {
			var st1 = new Stream();
			var st2 = new Stream();
			var client = coffea(st1);
			client.useStream(st2);

			client.on("0:invite", function (event) {
				event.user.getNick().should.equal('you');
				event.target.getNick().should.equal('me');
				event.channel.should.equal('#test');
				done();
			});

			client.on("1:invite", function (event) {
				event.user.getNick().should.equal('xddjshali');
				event.target.getNick().should.equal('you');
				event.channel.should.equal('#random');
				done();
			});

			st1.write(':you!are@so.cool.com INVITE me :#test\r\n');
			st2.write(':xddjshali!i@make.no.sense INVITE you :#random\r\n');
		});
	});
});
