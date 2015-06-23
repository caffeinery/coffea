/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('join.js', function() {
    describe('client.join()', function () {
        it('should join channels without a password', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('JOIN #test');
                    done();
                });
            });

            client.nick('test');
            client.join('#test');
        });

        it('should join channels with a password', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('JOIN #test test123');
                    done();
                });
            });

            client.nick('test');
            client.join(['#test'], ['test123']);
        });
    });

    describe('on JOIN without CAP EXTENDED-JOIN', function() {
        it('should emit "join" [single-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once("join", function (err, event) {
                event.user.getNick().should.equal('foo');
                event.channel.getName().should.equal('#baz');
                done();
            });

            client.nick('foo', st1_id);
            st1.write(':foo!bar@baz.com JOIN :#baz\r\n');
        });

        it('should emit "join" [multi-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('ChanServ', st1_id);
            client.nick('foo', st2_id);

            var tests = 0;
            client.on("join", function (err, event) {
                if (event.network === st1_id) {
                    event.user.getNick().should.equal('ChanServ');
                    event.channel.getName().should.equal('#services');
                } else {
                    event.user.getNick().should.equal('foo');
                    event.channel.getName().should.equal('#baz');
                }
                tests++;
                if (tests >= 2) {
                    done();
                }
            });

            st1.write(':ChanServ!ChanServ@services.in JOIN :#services\r\n');
            st2.write(':foo!bar@baz.com JOIN :#baz\r\n');
        });

        it('should emit "{network}:join" [multi-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('foo', st1_id);
            client.nick('foo', st2_id);

            var tests = 0;
            client.once(st1_id + ":join", function (err, event) {
                event.user.getNick().should.equal('ChanServ');
                event.channel.getName().should.equal('#services');
                tests++;
                if(tests >= 2) {
                    done();
                }
            });

            client.once(st2_id + ":join", function (err, event) {
                event.user.getNick().should.equal('foo');
                event.channel.getName().should.equal('#baz');
                tests++;
                if(tests >= 2) {
                    done();
                }
            });

            st1.write(':ChanServ!ChanServ@services.in JOIN :#services\r\n');
            st2.write(':foo!bar@baz.com JOIN :#baz\r\n');
        });
    });
    
    describe('on JOIN with CAP EXTENDED-JOIN', function() {
        it('should emit "extended-join" [no account, single network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once("extended-join", function (err, event) {
                event.user.getNick().should.equal('foo');
                event.channel.getName().should.equal('#baz');
                event.account.should.equal(null);
                event.realname.should.equal('Real Name');
                done();
            });

            client.nick('foo', st1_id);
            st1.write(':foo!bar@baz.com JOIN #baz * :Real Name\r\n');
        });

        it('should emit "extended-join" [account, single network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once("extended-join", function (err, event) {
                event.user.getNick().should.equal('foo');
                event.channel.getName().should.equal('#baz');
                event.account.should.equal('foobar');
                event.realname.should.equal('Real Name');
                done();
            });

            client.nick('foo', st1_id);
            st1.write(':foo!bar@baz.com JOIN #baz foobar :Real Name\r\n');
        });

        it('should emit "join" [multi network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('ChanServ', st1_id);
            client.nick('foo', st2_id);

            var tests = 0;
            client.on("extended-join", function (err, event) {
                if (event.network === st1_id) {
                    event.user.getNick().should.equal('ChanServ');
                    event.channel.getName().should.equal('#services');
                    event.account.should.equal('0');
                    event.realname.should.equal('Real Name');
                } else {
                    event.user.getNick().should.equal('foo');
                    event.channel.getName().should.equal('#baz');
                    event.account.should.equal('foobar');
                    event.realname.should.equal('Real Name');
                }
                tests++;
                if (tests >= 2) {
                    done();
                }
            });

            st1.write(':ChanServ!ChanServ@services.in JOIN #services 0 :Channel Services\r\n');
            st2.write(':foo!bar@baz.com JOIN #baz foobar :Real Name\r\n');
        });

        it('should emit "{network}:join" [multi-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('foo', st1_id);
            client.nick('foo', st2_id);

            var tests = 0;
            client.once(st1_id + ":join", function (err, event) {
                event.user.getNick().should.equal('ChanServ');
                event.channel.getName().should.equal('#services');
                tests++;
                if(tests >= 2) {
                    done();
                }
            });

            client.once(st2_id + ":join", function (err, event) {
                event.user.getNick().should.equal('foo');
                event.channel.getName().should.equal('#baz');
                tests++;
                if(tests >= 2) {
                    done();
                }
            });

            st1.write(':ChanServ!ChanServ@services.in JOIN :#services\r\n');
            st2.write(':foo!bar@baz.com JOIN :#baz\r\n');
        });
    });
});
