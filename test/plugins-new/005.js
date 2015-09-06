/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('005.js', function () {
    describe('005 numeric parse support', function () {
        it('should parse items such as "WHOX"', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            st1.write(':weber.freenode.net 005 foo CHANTYPES=# EXCEPTS INVEX CHANMODES=eIbq,k,flj,CFLMPQScgimnprstz CHANLIMIT=#:120 PREFIX=(ov)@+ MAXLIST=bqeI:100 MODES=4 NETWORK=freenode KNOCK STATUSMSG=@+ CALLERID=g :are supported by this server\r\n');
            st1.write(':weber.freenode.net 005 foo CASEMAPPING=rfc1459 CHARSET=ascii NICKLEN=16 CHANNELLEN=50 TOPICLEN=390 ETRACE CPRIVMSG CNOTICE DEAF=D MONITOR=100 FNC TARGMAX=NAMES:1,LIST:1,KICK:1,WHOIS:1,PRIVMSG:4,NOTICE:4,ACCEPT:,MONTIOR: :are supported by this server\r\n');
            st1.write(':weber.freenode.net 005 foo EXTBAN=$,ajrxz WHOX CLIENTVER=3.0 SAFELIST ELIST=CTU :are supported by this server\r\n');
            process.nextTick(function () {
                var settings = client.settings[st1_id];

                settings.excepts.should.equal(true);
                settings.invex.should.equal(true);
                settings.knock.should.equal(true);
                settings.etrace.should.equal(true);
                settings.cprivmsg.should.equal(true);
                settings.fnc.should.equal(true);
                settings.whox.should.equal(true);
                settings.safelist.should.equal(true);

                done();
            });
        });
        it('should parse items such as "CHANTYPES=#"', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            st1.write(':weber.freenode.net 005 foo CHANTYPES=# EXCEPTS INVEX CHANMODES=eIbq,k,flj,CFLMPQScgimnprstz CHANLIMIT=#:120 PREFIX=(ov)@+ MAXLIST=bqeI:100 MODES=4 NETWORK=freenode KNOCK STATUSMSG=@+ CALLERID=g :are supported by this server\r\n');
            st1.write(':weber.freenode.net 005 foo CASEMAPPING=rfc1459 CHARSET=ascii NICKLEN=16 CHANNELLEN=50 TOPICLEN=390 ETRACE CPRIVMSG CNOTICE DEAF=D MONITOR=100 FNC TARGMAX=NAMES:1,LIST:1,KICK:1,WHOIS:1,PRIVMSG:4,NOTICE:4,ACCEPT:,MONTIOR: :are supported by this server\r\n');
            st1.write(':weber.freenode.net 005 foo EXTBAN=$,ajrxz WHOX CLIENTVER=3.0 SAFELIST ELIST=CTU :are supported by this server\r\n');
            process.nextTick(function () {
                var settings = client.settings[st1_id];

                settings.chantypes.should.equal('#');
                settings.prefix.should.equal('(ov)@+');
                settings.modes.should.equal('4');
                settings.network.should.equal('freenode');
                settings.statusmsg.should.equal('@+');
                settings.callerid.should.equal('g');
                settings.casemapping.should.equal('rfc1459');
                settings.charset.should.equal('ascii');
                settings.nicklen.should.equal('16');
                settings.channellen.should.equal('50');
                settings.topiclen.should.equal('390');
                settings.deaf.should.equal('D');
                settings.monitor.should.equal('100');
                settings.clientver.should.equal('3.0');
                settings.elist.should.equal('CTU');

                done();
            });
        });
        it('should parse more complex values', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            st1.write(':weber.freenode.net 005 foo CHANTYPES=# EXCEPTS INVEX CHANMODES=eIbq,k,flj,CFLMPQScgimnprstz CHANLIMIT=#:120 PREFIX=(ov)@+ MAXLIST=bqeI:100 MODES=4 NETWORK=freenode KNOCK STATUSMSG=@+ CALLERID=g :are supported by this server\r\n');
            st1.write(':weber.freenode.net 005 foo CASEMAPPING=rfc1459 CHARSET=ascii NICKLEN=16 CHANNELLEN=50 TOPICLEN=390 ETRACE CPRIVMSG CNOTICE DEAF=D MONITOR=100 FNC TARGMAX=NAMES:1,LIST:1,KICK:1,WHOIS:1,PRIVMSG:4,NOTICE:4,ACCEPT:,MONTIOR: :are supported by this server\r\n');
            st1.write(':weber.freenode.net 005 foo EXTBAN=$,ajrxz WHOX CLIENTVER=3.0 SAFELIST ELIST=CTU :are supported by this server\r\n');
            process.nextTick(function () {
                var settings = client.settings[st1_id];

                settings.chanmodes.should.eql(['eIbq', 'k', 'flj', 'CFLMPQScgimnprstz']);
                settings.chanlimit.should.eql({'#': '120'});
                settings.maxlist.should.eql({'bqeI': '100'});
                settings.targmax.should.eql([{'NAMES': '1'}, {'LIST': '1'}, {'KICK': '1'}, {'WHOIS': '1'}, {'PRIVMSG': '4'}, {'NOTICE': '4'}, {'ACCEPT': ''}, {'MONTIOR': ''}]);
                settings.extban.should.eql(['$', 'ajrxz']);

                done();
            });
        });
    });
});
