/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('motd.js', function() {
	describe('on NOTICE', function() {
		it('should emit "motd" [single-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

			client.once("motd", function (err, event) {
				event.motd[0].should.equal('irc.local message of the day');
                event.motd[1].should.equal('- THE CAKE IS A LIE');
                event.motd[2].should.equal('End of message of the day.');
                done();
			});

			st1.write(':irc.local 375 foo :irc.local message of the day\r\n');
            st1.write(':irc.local 372 foo :- THE CAKE IS A LIE\r\n');
            st1.write(':irc.local 376 foo :End of message of the day.\r\n');
		});

		it('should emit "motd" [multi-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('baz', st1_id);
            client.nick('foo', st2_id);

			client.once("motd", function (err, event) {
				if (event.network === st1_id) {
					event.motd[0].should.equal('irc.local message of the day');
                    event.motd[1].should.equal('- THE CAKE IS A LIE');
                    event.motd[2].should.equal('End of message of the day.');
				} else {
					event.motd[0].should.equal('irc.local message of the day');
                    event.motd[1].should.equal('- This the charybdis default MOTD.');
                    event.motd[2].should.equal('- You might want to change this or your friends will laugh at you.');
                    event.motd[3].should.equal('End of message of the day.');
				}

                done();
			});

			st1.write(':irc.local 375 foo :irc.local message of the day\r\n');
            st1.write(':irc.local 372 foo :- THE CAKE IS A LIE\r\n');
            st1.write(':irc.local 376 foo :End of message of the day.\r\n');
            
            st2.write(':irc.local 375 foo :irc.local message of the day\r\n');
            st2.write(':irc.local 372 foo :- This the charybdis default MOTD.\r\n');
            st2.write(':irc.local 372 foo :- You might want to change this or your friends will laugh at you.\r\n');
            st2.write(':irc.local 376 foo :End of message of the day.\r\n');
		});

		it('should emit "{network}:motd" [multi-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('baz', st1_id);
            client.nick('foo', st2_id);

            var tests = 0;
			client.once(st1_id + ":motd", function (err, event) {
				event.motd[0].should.equal('irc.local message of the day');
                event.motd[1].should.equal('- THE CAKE IS A LIE');
                event.motd[2].should.equal('End of message of the day.');
                tests++;
                if (tests >= 2) {
                    done();
                }
			});

			client.once(st2_id + ":motd", function (err, event) {
				event.motd[0].should.equal('irc.local message of the day');
                event.motd[1].should.equal('- This the charybdis default MOTD.');
                event.motd[2].should.equal('- You might want to change this or your friends will laugh at you.');
                event.motd[3].should.equal('End of message of the day.');
                tests++;
                if (tests >= 2) {
                    done();
                }
			});

			st1.write(':irc.local 375 foo :irc.local message of the day\r\n');
            st1.write(':irc.local 372 foo :- THE CAKE IS A LIE\r\n');
            st1.write(':irc.local 376 foo :End of message of the day.\r\n');
            
            st2.write(':irc.local 375 foo :irc.local message of the day\r\n');
            st2.write(':irc.local 372 foo :- This the charybdis default MOTD.\r\n');
            st2.write(':irc.local 372 foo :- You might want to change this or your friends will laugh at you.\r\n');
            st2.write(':irc.local 376 foo :End of message of the day.\r\n');
		});
	});
});
