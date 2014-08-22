var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('nickserv.js', function() {
    describe('on connect', function() {
        it('should identify', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            client.once('data', function (event) {
                client.once('data', function (event) {
                    event.string.should.equal("PRIVMSG NickServ :IDENTIFY test password");
                    done();
                });
            });

            st1.write(':irc.local 001 :Welcome to testnet IRC Network foo!bar@baz.com');
            client.identify('test', 'password');
        });
    });
});
