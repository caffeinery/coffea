/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('numeric.js', function () {
    describe('on numeric', function() {
        it('should emit "numeric" [single-network]', function (done) {
            var st1 = new Stream();
            var client = coffea(st1, false);
            
            client.on('numeric', function (err, event) {
                event.numeric.should.equal('001');
                event.command.should.equal('RPL_WELCOME');
                done();
            });

            client.nick('foo');

            st1.write(':weber.freenode.net 001 foo Welcome to the Internet Relay Network foo!bar@example.org\r\n');
        });

        it('should emit "numeric" [multi-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);

            var tests = 0;
            client.on('numeric', function (err, event) {
                tests++;
                if (event.network === st1_id) {
                    event.numeric.should.equal('005');
                    event.command.should.equal('RPL_ISUPPORT');
                } else {
                    event.numeric.should.equal('001');
                    event.command.should.equal('RPL_WELCOME');
                }
                if (tests >= 2) {
                    done();
                }
            });

            client.nick('foo', st1_id);
            client.nick('foo', st2_id);

            st1.write(':weber.freenode.net 005 foo EXTBAN=$,ajrxz WHOX CLIENTVER=3.0 SAFELIST ELIST=CTU :are supported by this server\r\n');
            st2.write(':weber.freenode.net 001 foo Welcome to the Internet Relay Network foo!bar@example.org\r\n');
        });

        it('should emit "{network}:numeric" [multi-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);

            var tests = 0;
            client.on(st1_id + ":numeric", function (err, event) {
                event.numeric.should.equal('005');
                event.command.should.equal('RPL_ISUPPORT');
                tests++;
                if (tests >= 2) {
                    done();
                }
            });

            client.on(st2_id + ":numeric", function (err, event) {
                event.numeric.should.equal('001');
                event.command.should.equal('RPL_WELCOME');
                tests++;
                if (tests >= 2) {
                    done();
                }
            });

            client.nick('foo', st1_id);
            client.nick('foo', st2_id);

            st1.write(':weber.freenode.net 005 foo EXTBAN=$,ajrxz WHOX CLIENTVER=3.0 SAFELIST ELIST=CTU :are supported by this server\r\n');
            st2.write(':weber.freenode.net 001 foo Welcome to the Internet Relay Network foo!bar@example.org\r\n');
        });
    });

    describe('on specific numeric', function() {
        it('should emit the numeric number [single-network]', function (done) {
            var st1 = new Stream();
            var client = coffea(st1, false);
            
            client.on('001', function (event) {
                event.numeric.should.equal('001');
                event.command.should.equal('RPL_WELCOME');
                done();
            });

            client.nick('foo');

            st1.write(':weber.freenode.net 001 foo Welcome to the Internet Relay Network foo!bar@example.org\r\n');
        });

        it('should emit "{network}:{the numeric number}" [multi-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);

            var tests = 0;
            client.on(st1_id + ":005", function (err, event) {
                event.numeric.should.equal('005');
                event.command.should.equal('RPL_ISUPPORT');
                tests++;
                if (tests >= 2) {
                    done();
                }
            });

            client.on(st2_id + ":001", function (err, event) {
                event.numeric.should.equal('001');
                event.command.should.equal('RPL_WELCOME');
                tests++;
                if (tests >= 2) {
                    done();
                }
            });

            client.nick('foo', st1_id);
            client.nick('foo', st2_id);

            st1.write(':weber.freenode.net 005 foo EXTBAN=$,ajrxz WHOX CLIENTVER=3.0 SAFELIST ELIST=CTU :are supported by this server\r\n');
            st2.write(':weber.freenode.net 001 foo Welcome to the Internet Relay Network foo!bar@example.org\r\n');
        });
    });
});
