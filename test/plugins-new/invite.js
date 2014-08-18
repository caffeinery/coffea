var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('invite.js', function() {
	describe('on INVITE', function() {
		it('should emit "invite" [single-network]', function (done) {
            var client = coffea();
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('you', st1_id);

			client.once("invite", function (event) {
				event.user.getNick().should.equal('you');
				event.target.getNick().should.equal('me');
				event.channel.name.should.equal('#test');
				done();
			});

			st1.write(':you!are@so.cool.com INVITE me :#test\r\n');
		});

		it('should emit "invite" [multi-network]', function (done) {
            var client = coffea();
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('you', st1_id);
            client.nick('xddjshali', st2_id);

			client.once("invite", function (event) {
				if (event.network === st1_id) {
					event.user.getNick().should.equal('you');
					event.target.getNick().should.equal('me');
					event.channel.name.should.equal('#test');
				} else {
					event.user.getNick().should.equal('xddjshali');
					event.target.getNick().should.equal('you');
					event.channel.name.should.equal('#random');
				}
				done();
			});

			st1.write(':you!are@so.cool.com INVITE me :#test\r\n');
			st2.write(':xddjshali!i@make.no.sense INVITE you :#random\r\n');
		});

		it('should emit "{network}:invite" [multi-network]', function (done) {
            var client = coffea();
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('you', st1_id);
            client.nick('xddjshali', st2_id);

            var tests = 0;
			client.once(st1_id + ":invite", function (event) {
				event.user.getNick().should.equal('you');
				event.target.getNick().should.equal('me');
				event.channel.name.should.equal('#test');
				tests++;
                if(tests >= 2) {
                    done();
                }
			});

			client.once(st2_id + ":invite", function (event) {
				event.user.getNick().should.equal('xddjshali');
				event.target.getNick().should.equal('you');
				event.channel.name.should.equal('#random');
				tests++;
                if(tests >= 2) {
                    done();
                }
			});

			st1.write(':you!are@so.cool.com INVITE me :#test\r\n');
			st2.write(':xddjshali!i@make.no.sense INVITE you :#random\r\n');
		});
	});
});
