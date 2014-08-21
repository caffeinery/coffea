var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('privmsg.js', function() {
	describe('on NOTICE', function() {
		it('should emit "message" [single-network]', function (done) {
            var client = coffea();
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('baz', st1_id);

			client.once("message", function (event) {
				event.channel.getName().should.equal('#foo');
                event.user.getNick().should.equal('foo');
                event.message.should.equal('Hello World');
                event.isAction.should.equal(false);
                done();
			});

			st1.write(':foo!bar@baz.com PRIVMSG #foo :Hello World\r\n');
		});

		it('should emit "message" [multi-network]', function (done) {
            var client = coffea();
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('baz', st1_id);
            client.nick('foo', st2_id);

			client.once("message", function (event) {
				if (event.network === st1_id) {
					event.channel.getName().should.equal('#foo');
                    event.user.getNick().should.equal('foo');
                    event.message.should.equal('Hello World');
                    event.isAction.should.equal(false);
				} else {
					event.channel.getName().should.equal('#foo');
                    event.user.getNick().should.equal('foo');
                    event.message.should.equal('waves');
                    event.isAction.should.equal(true);
				}

                done();
			});

			st1.write(':foo!bar@baz.com PRIVMSG #foo :Hello World\r\n');
			st2.write(':foo!bar@baz.com PRIVMSG #foo :\u0001ACTION waves\u0001\r\n');
		});

		it('should emit "{network}:message" [multi-network]', function (done) {
            var client = coffea();
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('baz', st1_id);
            client.nick('foo', st2_id);

            var tests = 0;
			client.once(st1_id + ":message", function (event) {
				event.channel.getName().should.equal('#foo');
                event.user.getNick().should.equal('foo');
                event.message.should.equal('Hello World');
                event.isAction.should.equal(false);
                tests++;
                if (tests >= 2) {
                    done();
                }
			});

			client.once(st2_id + ":message", function (event) {
				event.channel.getName().should.equal('#foo');
                event.user.getNick().should.equal('foo');
                event.message.should.equal('waves');
                event.isAction.should.equal(true);
                tests++;
                if (tests >= 2) {
                    done();
                }
			});

			st1.write(':foo!bar@baz.com PRIVMSG #foo :Hello World\r\n');
            st2.write(':foo!bar@baz.com PRIVMSG #foo :\u0001ACTION waves\u0001\r\n');
		});
	});
});
