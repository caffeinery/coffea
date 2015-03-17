/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('away.js', function() {
    describe('on RPL_AWAY', function() {
        it('should emit "away" [single-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            client.nick('me', st1_id);

            client.once("away", function (err, event) {
                event.user.getNick().should.equal('you');
                event.message.should.equal('not here');
                done();
            });

            st1.write(':irc.local 301 me you :not here\r\n');
        });

        it('should emit "away" [multi-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('you', st1_id);
            client.nick('me', st2_id);

            client.once("away", function (err, event) {
                if (event.network === st1_id) {
                    event.user.getNick().should.equal('me');
                    event.message.should.equal('auto away');
                } else {
                    event.user.getNick().should.equal('you');
                    event.message.should.equal('not here');
                }
                done();
            });

            st1.write(':irc.local 301 you me :auto away\r\n');
            st2.write(':irc.local 301 me you :not here\r\n');
        });

        it('should emit "{network}:away" [multi-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('you', st1_id);
            client.nick('me', st2_id);

            var tests = 0;
            client.once(st1_id + ":away", function (err, event) {
                event.user.getNick().should.equal('me');
                event.message.should.equal('auto away');
                tests++;
                if(tests >= 2) {
                    done();
                }
            });

            client.once(st2_id + ":away", function (err, event) {
                event.user.getNick().should.equal('you');
                event.message.should.equal('not here');
                tests++;
                if(tests >= 2) {
                    done();
                }
            });

            st1.write(':irc.local 301 you me :auto away\r\n');
            st2.write(':irc.local 301 me you :not here\r\n');
        });
    });

    describe('client.away()', function () {
        it('should send a valid AWAY command', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function () {
                client.once('data', function (data) {
                    data.string.should.equal('AWAY :not here')
                    done();
                });
            });
            
            client.nick('me', st1_id);
            client.away('not here', st1_id);
        })
    });
});
