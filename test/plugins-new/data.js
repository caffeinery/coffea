var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('data.js', function() {
	describe('on DATA', function() {
		it('should emit "data" [single-network]', function (done) {
			var st1 = new Stream();
			var client = coffea(st1);

			client.on("data", function (event) {
				event.prefix.should.equal('irc.local');
				event.command.should.equal('NOTICE');
				event.params.should.equal('*');
				event.trailing.should.equal('*** Looking up your hostname...');
				event.string.should.equal(':irc.local NOTICE * :*** Looking up your hostname...');
			});

			st1.write(':irc.local NOTICE * :*** Looking up your hostname...\r\n');
		});

		it('should emit "data" [multi-network]', function (done) {
			var st1 = new Stream();
			var st2 = new Stream();
			var client = coffea(st1);
			client.useStream(st2);

			client.on("data", function (event) {
				if (event.network === 0) {
					event.prefix.should.equal('mike!mike@mike.is.awesome');
					event.command.should.equal('PRIVMSG');
					event.params.should.equal('#test');
					event.trailing.should.equal('Testing, one-two.');
					event.string.should.equal(':mike!mike@mike.is.awesome PRIVMSG #test :Testing, one-two.');
				} else {
					event.prefix.should.equal('irc.local');
					event.command.should.equal('NOTICE');
					event.params.should.equal('*');
					event.trailing.should.equal('*** Looking up your hostname...');
					event.string.should.equal(':irc.local NOTICE * :*** Looking up your hostname...');
				}
				done();
			});

			st1.write(':mike!mike@mike.is.awesome PRIVMSG #test :Testing, one-two.\r\n');
			st2.write(':irc.local NOTICE * :*** Looking up your hostname...\r\n');
		});

		it('should emit "{network}:data" [multi-network]', function (done) {
			var st1 = new Stream();
			var st2 = new Stream();
			var client = coffea(st1);
			client.useStream(st2);

			client.on("0:data", function (event) {
				event.prefix.should.equal('mike!mike@mike.is.awesome');
				event.command.should.equal('PRIVMSG');
				event.params.should.equal('#test');
				event.trailing.should.equal('Testing, one-two.');
				event.string.should.equal(':mike!mike@mike.is.awesome PRIVMSG #test :Testing, one-two.');
				done();
			});

			client.on("1:data", function (event) {
				event.prefix.should.equal('irc.local');
				event.command.should.equal('NOTICE');
				event.params.should.equal('*');
				event.trailing.should.equal('*** Looking up your hostname...');
				event.string.should.equal(':irc.local NOTICE * :*** Looking up your hostname...');
				done();
			});

			st1.write(':mike!mike@mike.is.awesome PRIVMSG #test :Testing, one-two.\r\n');
			st2.write(':irc.local NOTICE * :*** Looking up your hostname...\r\n');
		});
	});
});