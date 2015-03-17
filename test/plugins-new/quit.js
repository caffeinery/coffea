/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('quit.js', function() {
  describe('client.quit()', function () {
      it('should send quit without reason', function (done) {
          var client = coffea(null, false);
          var st1 = new Stream();
          var st1_id = client.add(st1);

          client.once('data', function (data) {
              client.once('data', function (data) {
                  data.string.should.equal('QUIT');
                  done();
              });
          });

          client.nick('test');
          client.quit();
      });

      it('should send quit with reason', function (done) {
          var client = coffea(null, false);
          var st1 = new Stream();
          var st1_id = client.add(st1);

          client.once('data', function (data) {
              client.once('data', function (data) {
                  data.string.should.equal('QUIT :See ya soon!');
                  done();
              });
          });

          client.nick('test');
          client.quit("See ya soon!");
      });
  });

	describe('on QUIT', function() {
		it('should emit "quit" [single-network]', function (done) {
			var st1 = new Stream();
			var client = coffea(st1, false);

			client.once("quit", function (err, event) {
				event.user.getNick().should.equal('foo');
                event.message.should.equal('Client Quit');
				done();
			});

			st1.write(':foo!bar@baz.com QUIT :Client Quit\r\n');
		});

		it('should emit "quit" [multi-network]', function (done) {
			var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('foo', st1_id);
            client.nick('ChanServ', st2_id);

			client.once("quit", function (err, event) {
				if (event.network == 0) {
					event.user.getNick().should.equal('foo');
	                event.message.should.equal('Client Quit');
				} else {
					event.user.getNick().should.equal('ChanServ');
                	event.message.should.equal('shutting down');
				}
			});

			st2.write(':ChanServ!ChanServ@services.int QUIT :shutting down\r\n');
			st1.write(':foo!bar@baz.com QUIT :Client Quit\r\n');
			done();
		});

		it('should emit "{network}:quit" [multi-network]', function (done) {
			var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('foo', st1_id);
            client.nick('ChanServ', st2_id);

			client.once(st1_id + ":quit", function (err, event) {
				event.user.getNick().should.equal('foo');
	            event.message.should.equal('Client Quit');
			});

			client.once(st2_id + ":quit", function (err, event) {
				event.user.getNick().should.equal('ChanServ');
                event.message.should.equal('shutting down');
			});

			st2.write(':ChanServ!ChanServ@services.int QUIT :shutting down\r\n');
			st1.write(':foo!bar@baz.com QUIT :Client Quit\r\n');
			done();
		});
	});
});
