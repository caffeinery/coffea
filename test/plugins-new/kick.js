/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('kick.js', function() {
    describe('client.kick()', function () {
        it('should kick without a kick message', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('KICK #test mike');
                    done();
                });
            });

            client.nick('test');
            client.kick(['#test'], 'mike');
        });

        it('should kick multiple people without a kick message', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('KICK #test mike,dan');
                    done();
                });
            });

            client.nick('test');
            client.kick(['#test'], ['mike', 'dan']);
        });

        it('should kick with a kick message', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('KICK #test mike :you should know better');
                    done();
                });
            });

            client.nick('test');
            client.kick(['#test'], 'mike', 'you should know better');
        });

        it('should kick multiple people with a kick message', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('KICK #test mike,dan :you should know better');
                    done();
                });
            });

            client.nick('test');
            client.kick(['#test'], ['mike', 'dan'], 'you should know better');
        });
    });

    describe('on KICK', function() {
        it('should emit "kick" [single-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once("kick", function (err, event) {
                event.channel.getName().should.equal('#foo');
                event.user.getNick().should.equal('bar');
                event.by.getNick().should.equal('foo');
                event.reason.should.equal('Your behaviour is not conductive to the desired environment.');
                done();
            });

            client.nick('foo', st1_id);
            st1.write(':foo!bar@baz.com KICK #foo bar :Your behaviour is not conductive to the desired environment.\r\n');
        });

        it('should emit "kick" [multi-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('foo', st1_id);
            client.nick('evilop', st2_id);

            client.once("kick", function (err, event) {
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
            var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('foo', st1_id);
            client.nick('evilop', st2_id);

            var tests = 0;
            client.once(st1_id + ":kick", function (err, event) {
                event.channel.getName().should.equal('#foo');
                event.user.getNick().should.equal('bar');
                event.by.getNick().should.equal('foo');
                event.reason.should.equal('Your behaviour is not conductive to the desired environment.');
                tests++;
                if(tests >= 2) {
                    done();
                }
            });

            client.once(st2_id + ":kick", function (err, event) {
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
