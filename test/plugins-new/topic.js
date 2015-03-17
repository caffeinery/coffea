/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('topic.js', function() {
    describe('client.topic()', function () {
        it('should change topic', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('TOPIC #test :this is a test channel');
                    done();
                });
            });

            client.nick('test');
            client.topic('#test', 'this is a test channel');
        });

        it('should change topic to nothing', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('TOPIC #test :');
                    done();
                });
            });

            client.nick('test');
            client.topic('#test', '');
        });
    });

	describe('on TOPIC', function() {
        it('should accept "topic" on entering channel', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            client.once("topic", function (err, event) {
                event.channel.getName().should.equal('#foo');
                event.topic.should.equal('HOT TOPIC');
                event.user.getNick().should.equal('foo');
                event.time.should.be.an.instanceof(Date);
                event.time.getTime().should.equal(1391341086 * 1000);
                event.changed.should.equal(false);
                done();
            });

            st1.write(':irc.net 332 foo #foo :HOT TOPIC\r\n');
            st1.write(':irc.net 333 foo #foo foo!bar@baz.com 1391341086\r\n');
        });

		it('should emit "topic" [single-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

			client.once("topic", function (err, event) {
				event.channel.getName().should.equal('#foo');
                event.topic.should.equal('HOT TOPIC');
                event.user.getNick().should.equal('foo');
                event.time.should.be.an.instanceof(Date);
                event.time.getTime().should.be.within(new Date().getTime() - 10, new Date().getTime() + 10);//~ now
                event.changed.should.equal(true);
                done();
			});

            st1.write(':foo!bar@baz.com TOPIC #foo :HOT TOPIC\r\n');
		});

		it('should emit "topic" [multi-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('foo', st1_id);
            client.nick('bar', st2_id);

			client.once("topic", function (err, event) {
				if (event.network === st1_id) {
					event.channel.getName().should.equal('#foo');
                    event.topic.should.equal('HOT TOPIC');
                    event.user.getNick().should.equal('foo');
                    event.time.should.be.an.instanceof(Date);
                    event.time.getTime().should.be.within(new Date().getTime() - 10, new Date().getTime() + 10);//~ now
                    event.changed.should.equal(true);
				} else {
					event.channel.getName().should.equal('#foo');
                    event.topic.should.equal('~~~the topic changes~~~');
                    event.user.getNick().should.equal('bar');
                    event.time.should.be.an.instanceof(Date);
                    event.time.getTime().should.be.within(new Date().getTime() - 10, new Date().getTime() + 10);//~ now
                    event.changed.should.equal(true);
				}
				done();
			});

			st1.write(':foo!bar@baz.com TOPIC #foo :HOT TOPIC\r\n');
			st2.write(':bar!baz@foo.com TOPIC #foo :~~~the topic changes~~~\r\n');
		});

		it('should emit "{network}:topic" [multi-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('foo', st1_id);
            client.nick('bar', st2_id);

            var tests = 0;
			client.once(st1_id + ":topic", function (err, event) {
				event.channel.getName().should.equal('#foo');
                event.topic.should.equal('HOT TOPIC');
                event.user.getNick().should.equal('foo');
                event.time.should.be.an.instanceof(Date);
                event.time.getTime().should.be.within(new Date().getTime() - 10, new Date().getTime() + 10);//~ now
                event.changed.should.equal(true);
				tests++;
                if(tests >= 2) {
                    done();
                }
			});

			client.once(st2_id + ":topic", function (err, event) {
				event.channel.getName().should.equal('#foo');
                event.topic.should.equal('~~~the topic changes~~~');
                event.user.getNick().should.equal('bar');
                event.time.should.be.an.instanceof(Date);
                event.time.getTime().should.be.within(new Date().getTime() - 10, new Date().getTime() + 10);//~ now
                event.changed.should.equal(true);
				tests++;
                if(tests >= 2) {
                    done();
                }
			});

			st1.write(':foo!bar@baz.com TOPIC #foo :HOT TOPIC\r\n');
            st2.write(':bar!baz@foo.com TOPIC #foo :~~~the topic changes~~~\r\n');
		});
	});
});
