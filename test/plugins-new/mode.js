/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('mode.js', function () {
    describe('client.mode()', function () {
        it('should send a mode with parameters', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('MODE #test +bm nick!user@host');
                    done();
                });
            });

            client.nick('test');
            client.mode('#test', '+bm nick!user@host');
        });

        it('should send a mode without parameters', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('MODE #test +i');
                    done();
                });
            });

            client.nick('test');
            client.mode('#test', '+i');
        });
    });

    describe('on MODE', function () {
        it('should parse usermode', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            client.on('mode', function (err, event) {
                event.by.getNick().should.equal('foo');
                event.adding.should.equal(true);
                event.mode.should.equal('x');
                done();
            });

            st1.write(':foo!bar@baz.com MODE foo +x\r\n');
        });
        it('should parse usermode aswell', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            client.once('mode', function (err, event) {
                event.by.should.equal('irc.local');
                event.adding.should.equal(true);
                event.mode.should.equal('Z');

                client.once('mode', function (err, event) {
                    event.by.should.equal('irc.local');
                    event.adding.should.equal(true);
                    event.mode.should.equal('i');
                    done();
                });
            });

            st1.write(':irc.local MODE foo :+Zi\r\n');
        });
        it('should parse channelmode [single-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            client.once('mode', function (err, event) {
                event.channel.getName().should.equal('#foo');
                event.by.getNick().should.equal('foo');
                event.argument.should.equal('bar');
                event.adding.should.equal(false);
                event.mode.should.equal('o');

                client.once('mode', function (err, event) {
                    event.channel.getName().should.equal('#foo');
                    event.by.getNick().should.equal('foo');
                    event.argument.should.equal('baz');
                    event.adding.should.equal(true);
                    event.mode.should.equal('v');

                    done();
                });
            });

            st1.write(':foo!bar@baz.com MODE #foo -o+v bar baz\r\n');
        });

        it('should parse channelmode [multi-network 1]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('foo', st1_id);
            client.nick('bar', st2_id);

            client.once('mode', function (err, event) {
                event.channel.getName().should.equal('#foo');
                event.by.getNick().should.equal('foo');
                event.argument.should.equal('bar');
                event.adding.should.equal(false);
                event.mode.should.equal('o');
                event.network.should.equal(st1_id);

                client.once('mode', function (err, event) {
                    event.channel.getName().should.equal('#foo');
                    event.by.getNick().should.equal('foo');
                    event.argument.should.equal('baz');
                    event.adding.should.equal(true);
                    event.mode.should.equal('v');
                    event.network.should.equal(st1_id);
                
                    client.once('mode', function (err, event) {
                        event.channel.getName().should.equal('#foo');
                        event.by.getNick().should.equal('op');
                        event.argument.should.equal('badguy');
                        event.adding.should.equal(true);
                        event.mode.should.equal('b');
                        event.network.should.equal(st2_id);
                        done();
                    });
                });
            });

            st1.write(':foo!bar@baz.com MODE #foo -o+v bar baz\r\n');
            st2.write(':op!bar@baz.com MODE #foo +b badguy\r\n');
        });

        it('should parse channelmode [multi-network 2]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('foo', st1_id);
            client.nick('bar', st2_id);

            var tests = 0;
            client.once(st1_id + ':mode', function (err, event) {
                event.channel.getName().should.equal('#foo');
                event.by.getNick().should.equal('foo');
                event.argument.should.equal('bar');
                event.adding.should.equal(false);
                event.mode.should.equal('o');

                client.once(st1_id + ':mode', function (err, event) {
                    event.channel.getName().should.equal('#foo');
                    event.by.getNick().should.equal('foo');
                    event.argument.should.equal('baz');
                    event.adding.should.equal(true);
                    event.mode.should.equal('v');

                    tests++;
                    if(tests >= 2) {
                        done();
                    }
                });
            });

            client.once(st2_id + ':mode', function (err, event) {
                event.channel.getName().should.equal('#foo');
                event.by.getNick().should.equal('op');
                event.argument.should.equal('badguy');
                event.adding.should.equal(true);
                event.mode.should.equal('b');
                tests++;
                if(tests >= 2) {
                    done();
                }
            });

            st1.write(':foo!bar@baz.com MODE #foo -o+v bar baz\r\n');
            st2.write(':op!bar@baz.com MODE #foo +b badguy\r\n');
        });
    });
});
