/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('notice.js', function() {
  describe('client.notice()', function () {
      it('should send notice to user', function (done) {
          var client = coffea(null, false);
          var st1 = new Stream();
          var st1_id = client.add(st1);

          client.once('data', function (data) {
              client.once('data', function (data) {
                  data.string.should.equal('NOTICE mike :Hi');
                  done();
              });
          });

          client.nick('test');
          client.notice('mike', 'Hi');
      });

      it('should send notice to channel', function (done) {
          var client = coffea(null, false);
          var st1 = new Stream();
          var st1_id = client.add(st1);

          client.once('data', function (data) {
              client.once('data', function (data) {
                  data.string.should.equal('NOTICE #test :Hi');
                  done();
              });
          });

          client.nick('test');
          client.notice('#test', 'Hi');
      });

      it('should send notice to multiple targets', function (done) {
          var client = coffea(null, false);
          var st1 = new Stream();
          var st1_id = client.add(st1);

          client.once('data', function (data) {
              client.once('data', function (data) {
                  data.string.should.equal('NOTICE #test,mike :Hi');
                  done();
              });
          });

          client.nick('test');
          client.notice(['#test', 'mike'], 'Hi');
      });

      it('should send a mass notice [oper-only]', function (done) {
          var client = coffea(null, false);
          var st1 = new Stream();
          var st1_id = client.add(st1);

          client.once('data', function (data) {
              client.once('data', function (data) {
                  data.string.should.equal('NOTICE $$*.freenode.net :[Network Notice] Hi everyone!');
                  done();
              });
          });

          client.nick('test');
          client.notice('$$*.freenode.net', '[Network Notice] Hi everyone!');
      });
  });

	describe('on NOTICE', function() {
		it('should emit "notice" [single-network]', function (done) {
            var client = coffea();
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('troll', st1_id);

			client.once("notice", function (err, event) {
				event.from.getNick().should.equal('troll');
                event.to.should.equal('#test');
                event.message.should.equal('This pings a lot of clients. You mad? \\:D/');
				done();
			});

			st1.write(':troll!pro@troll.co NOTICE #test :This pings a lot of clients. You mad? \\:D/\r\n');
		});

		it('should emit "notice" [multi-network]', function (done) {
            var client = coffea();
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('N', st1_id);
            client.nick('troll', st2_id);

			client.once("notice", function (err, event) {
				if (event.network === st1_id) {
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
            var client = coffea();
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('NickServ', st1_id);
            client.nick('troll', st2_id);

			client.once(st1_id + ":notice", function (err, event) {
				event.from.getNick().should.equal('NickServ');
                event.to.should.equal('foo');
                event.message.should.equal('This nickname is registered. Please choose a different nickname, or identify via /msg NickServ identify <password>.');
			});

			client.once(st2_id + ":notice", function (err, event) {
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
