var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('kick.js', function() {
	describe('on KICK', function() {
		it('should emit "kick" [single-network]', function (done) {
			var client = coffea();
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

			client.once("kick", function (event) {
                event.channel.getName().should.equal('#foo');
                event.user.getNick().should.equal('bar');
                event.by.getNick().should.equal('foo');
                event.reason.should.equal('Your behaviour is not conductive to the desired environment.');
				done();
			});

			st1.write(':foo!bar@baz.com KICK #foo bar :Your behaviour is not conductive to the desired environment.\r\n');
		});

		it('should emit "kick" [multi-network]', function (done) {
			var client = coffea();
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('foo', st1_id);
            client.nick('evilop', st2_id);

			client.once("kick", function (event) {
				if (event.network === st1_id) {
					event.channel.getName().should.equal('#foo');
                	event.user.getNick().should.equal('bar');
                	event.by.getNick().should.equal('foo');
                	event.reason.should.equal('Your behaviour is not conductive to the desired environment.');
				} else {
					event.channel.getName().should.equal('#foo');
                	event.user.getNick().should.equal('foo');
                	event.by.getNick().should.equal('evilop');
                	event.reason.should.equal('You have got to be kidding.');
				}
				done();
			});

			st1.write(':foo!bar@baz.com KICK #foo bar :Your behaviour is not conductive to the desired environment.\r\n');
			st2.write(':evilop!op@troll.com KICK #foo foo :You have got to be kidding.\r\n');
		});

		it('should emit "{network}:kick" [multi-network]', function (done) {
			var client = coffea();
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('foo', st1_id);
            client.nick('evilop', st2_id);

            var tests = 0;
			client.once(st1_id + ":kick", function (event) {
				event.channel.getName().should.equal('#foo');
                event.user.getNick().should.equal('bar');
                event.by.getNick().should.equal('foo');
                event.reason.should.equal('Your behaviour is not conductive to the desired environment.');
				tests++;
                if(tests >= 2) {
                    done();
                }
			});

			client.once(st2_id + ":kick", function (event) {
				event.channel.getName().should.equal('#foo');
                event.user.getNick().should.equal('foo');
                event.by.getNick().should.equal('evilop');
                event.reason.should.equal('You have got to be kidding.');
				tests++;
                if(tests >= 2) {
                    done();
                }
			});

			st1.write(':foo!bar@baz.com KICK #foo bar :Your behaviour is not conductive to the desired environment.\r\n');
			st2.write(':evilop!op@troll.com KICK #foo foo :You have got to be kidding.\r\n');
		});
	});
});
