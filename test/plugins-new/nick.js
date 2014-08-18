var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('nick.js', function() {
	describe('on NICK', function() {
		it('should emit "nick" [single-network]', function (done) {
			var st1 = new Stream();
			var client = coffea(st1);

			client.on("nick", function (event) {
				event.user.getNick().should.equal('evilop');
                event.oldNick.should.equal('troll');
				done();
			});

			st2.write(':troll!evilop@yo.um.ad NICK evilop\r\n');
		});

		it('should emit "nick" [multi-network]', function (done) {
			var st1 = new Stream();
			var st2 = new Stream();
			var client = coffea(st1);
			client.useStream(st2);

			client.on("nick", function (event) {
				if (event.network === 0) {
					event.user.getNick().should.equal('ChanServ');
                	event.oldNick.should.equal('NickServ');
				} else {
					event.user.getNick().should.equal('evilop');
                	event.oldNick.should.equal('troll');
				}
			});

			st1.write(':NickServ!NickServ@services. NICK ChanServ\r\n');
			st2.write(':troll!evilop@yo.um.ad NICK evilop\r\n');
		
			done();
		});

		it('should emit "{network}:nick" [multi-network]', function (done) {
			var st1 = new Stream();
			var st2 = new Stream();
			var client = coffea(st1);
			client.useStream(st2);

			client.on("0:nick", function (event) {
				event.user.getNick().should.equal('ChanServ');
                event.oldNick.should.equal('NickServ');
			});

			client.on("1:nick", function (event) {
				event.user.getNick().should.equal('evilop');
                event.oldNick.should.equal('troll');
			});

			st1.write(':NickServ!NickServ@services. NICK ChanServ\r\n');
			st2.write(':troll!evilop@yo.um.ad NICK evilop\r\n');			st2.write(':troll!evilop@yo.um.ad NICK evilop\r\n');
		
			done();
		});
	});

	describe("on ERR_NICKNAMEINUSE", function() {
		it("should add _ to nickname", function(done) {
			var st1 = new Stream();
			var client = coffea(st1);

			client.nick('bar');
			st1.write(':irc.local 433 * foo :Nickname is already in use.\r\n');

			process.nextTick(function () {
				client.getUser.getNick.should.equal('foo_');
				st1.write(':irc.local 433 * foo_ :Nickname is already in use.\r\n');
				process.nextTick(function () {
					client.getUser.getNick.should.equal('foo__');
					done();
				});
			});
		});
	});
});
