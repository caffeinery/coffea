/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('names.js', function() {
	describe('on NAMES', function() {
		it('should emit "names" [single-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

			client.once("names", function (err, event) {
				event.names.should.eql({
                    "dan": ['@'],
                    "mike": ['@'],
                    "coffea28329": [],
                    "coffea": ['+']
                });
                done();
			});

			st1.write(':irc.local 353 foo @ #test :@dan +coffea coffea28329 @mike\r\n');
            st1.write(':irc.local 366 foo #test :End of /NAMES list.\r\n');
		});

		it('should emit "names" [multi-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('baz', st1_id);
            client.nick('foo', st2_id);

			client.once("names", function (err, event) {
				if (event.network === st1_id) {
					event.names.should.eql({
                        "dan": ['@'],
                        "mike": ['@'],
                        "coffea28329": [],
                        "coffea": ['+']
                    });
				} else {
					event.names.should.eql({
                        "foo": ['@']
                    });
				}

                done();
			});

			st1.write(':irc.local 353 foo @ #test :@dan +coffea coffea28329 @mike\r\n');
            st1.write(':irc.local 366 foo #test :End of /NAMES list.\r\n');
            
            st2.write(':irc.local 353 foo @ #test :@foo\r\n');
            st2.write(':irc.local 366 foo #test :End of /NAMES list.\r\n');
		});

		it('should emit "{network}:names" [multi-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('baz', st1_id);
            client.nick('foo', st2_id);

            var tests = 0;
			client.once(st1_id + ":names", function (err, event) {
				event.names.should.eql({
                    "dan": ['@'],
                    "mike": ['@'],
                    "coffea28329": [],
                    "coffea": ['+']
                });
                tests++;
                if (tests >= 2) {
                    done();
                }
			});

			client.once(st2_id + ":names", function (err, event) {
				event.names.should.eql({
                    "foo": ['@']
                });
                tests++;
                if (tests >= 2) {
                    done();
                }
			});

            st1.write(':irc.local 353 foo @ #test :@dan +coffea coffea28329 @mike\r\n');
            st1.write(':irc.local 366 foo #test :End of /NAMES list.\r\n');
            
            st2.write(':irc.local 353 foo @ #test :@foo\r\n');
            st2.write(':irc.local 366 foo #test :End of /NAMES list.\r\n');
		});
	});
});
