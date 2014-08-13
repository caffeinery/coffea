var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('notice.js', function() {
	describe('on NOTICE', function() {
		it('should emit "notice" [single-network]', function (done) {
			var st1 = new Stream();
			var client = coffea(st1);

			client.on("notice", function (event) {
				event.from.getNick().should.equal('troll');
                event.to.should.equal('#test');
                event.message.should.equal('This pings a lot of clients. You mad? \\:D/');
				done();
			});

			st1.write(':troll!pro@troll.co NOTICE #test :This pings a lot of clients. You mad? \\:D/\r\n');
		});

		it('should emit "notice" [multi-network]', function (done) {
			var st1 = new Stream();
			var st2 = new Stream();
			var client = coffea(st1);
			client.useStream(st2);

			client.on("notice", function (event) {
				if (event.network == 0) {
					event.from.getNick().should.equal('NickServ');
                	event.to.should.equal('foo');
                	event.message.should.equal('This nickname is registered. Please choose a different nickname, or identify via /msg NickServ identify <password>.');
				} else {
					event.from.getNick().should.equal('troll');
                	event.to.should.equal('#test');
                	event.message.should.equal('This pings a lot of clients. You mad? \\:D/');
				}
			});

			st1.write(':NickServ!NickServ@services. NOTICE foo :This nickname is registered. Please choose a different nickname, or identify via /msg NickServ identify <password>.\r\n');
			st2.write(':troll!pro@troll.co NOTICE #test :This pings a lot of clients. You mad? \\:D/\r\n');
		
			done();
		});

		it('should emit "{network}:notice" [multi-network]', function (done) {
			var st1 = new Stream();
			var st2 = new Stream();
			var client = coffea(st1);
			client.useStream(st2);

			client.on("0:notice", function (event) {
				event.from.getNick().should.equal('NickServ');
                event.to.should.equal('foo');
                event.message.should.equal('This nickname is registered. Please choose a different nickname, or identify via /msg NickServ identify <password>.');
			});

			client.on("1:notice", function (event) {
				event.from.getNick().should.equal('troll');
                event.to.should.equal('#test');
                event.message.should.equal('This pings a lot of clients. You mad? \\:D/');
			});

			st1.write(':NickServ!NickServ@services. NOTICE foo :This nickname is registered. Please choose a different nickname, or identify via /msg NickServ identify <password>.\r\n');
			st2.write(':troll!pro@troll.co NOTICE #test :This pings a lot of clients. You mad? \\:D/\r\n');
		
			done();
		});
	});
});
