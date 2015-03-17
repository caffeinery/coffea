/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('nick.js', function() {
    describe('client.nick()', function () {
        it('should send NICK', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('NICK test2');
                    done();
                });
            });

            client.nick('test');
            client.nick('test2');
        });
    });
    
    describe('on NICK', function() {
        it('should emit "nick" [single-network]', function (done) {
            var st1 = new Stream();
            var client = coffea(st1, false);
            
            client.once('nick', function () {
                client.once('nick', function (err, event) {
                    event.user.getNick().should.equal('evilop');
                    event.oldNick.should.equal('troll');
                    done();
                });
            });

            client.nick('troll'); // initialize user

            // send nick change message
            st1.write(':troll!evilop@yo.um.ad NICK evilop\r\n');
        });

        it('should emit "nick" [multi-network]', function (done) {
            var client = coffea(null, false); // initialize coffea
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1); // add stream to client
            var st2_id = client.add(st2); // add stream to client

            var tests = 0;
            client.on('nick', function (err, event) {
                tests++;
                if ((tests == 2) && (tests == 4)) {
                    if (event.network === st1_id) {
                        event.user.getNick().should.equal('ChanServ');
                        event.oldNick.should.equal('NickServ');
                    } else {
                        event.user.getNick().should.equal('evilop');
                        event.oldNick.should.equal('troll');
                    }
                }
                if (tests >= 4) {
                    done(); // call done when the test is actually done (async)
                }
            });

            client.nick('NickServ', st1_id); // initialize user on stream 1
            client.nick('troll', st2_id); // initialize user on stream 2

            st1.write(':NickServ!NickServ@services. NICK ChanServ\r\n');
            st2.write(':troll!evilop@yo.um.ad NICK evilop\r\n');
        });

        it('should emit "{network}:nick" [multi-network]', function (done) {
            var client = coffea(null, false); // initialize coffea
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1); // add stream to client
            var st2_id = client.add(st2); // add stream to client

            var tests = 0;
            client.once(st1_id + ":nick", function() {
                client.once(st1_id + ":nick", function (err, event) {
                    event.user.getNick().should.equal('ChanServ');
                    event.oldNick.should.equal('NickServ');
                    tests++;
                    if (tests >= 2) {
                        done(); // call done when the test is actually done (async)
                    }
                });
            });

            client.once(st2_id + ":nick", function() {
                client.once(st2_id + ":nick", function (err, event) {
                    event.user.getNick().should.equal('evilop');
                    event.oldNick.should.equal('troll');
                    tests++;
                    if (tests >= 2) {
                        done(); // call done when the test is actually done (async)
                    }
                });
            });
            
            client.nick('NickServ', st1_id); // initialize user on stream 1
            client.nick('troll', st2_id); // initialize user on stream 2
            st1.write(':NickServ!NickServ@services. NICK ChanServ\r\n');
            st2.write(':troll!evilop@yo.um.ad NICK evilop\r\n');
        });
    });

    describe("on ERR_NICKNAMEINUSE", function() {
        it("should add _ to nickname", function(done) {
            var st1 = new Stream();
            var client = coffea(st1, false);

            client.nick('foo');
            st1.write(':irc.local 433 * foo :Nickname is already in use.\r\n');

            process.nextTick(function () {
                client.getUser().getNick().should.equal('foo_');
                st1.write(':irc.local 433 * foo_ :Nickname is already in use.\r\n');
                process.nextTick(function () {
                    client.getUser().getNick().should.equal('foo__');
                    done();
                });
            });
        });
    });
});
