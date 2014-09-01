var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('nickserv.js', function() {
    describe('on connect', function() {
        it('should identify', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            st1.write(':irc.local 001 :Welcome to testnet IRC Network foo!bar@baz.com');
            client.nick('foo', st1_id);
            
            client.identify('test', 'password', st1_id);

            client.on('data', function (event) {
                console.log(event.string);
                if (event.command == "PRIVMSG") {
                    event.string.should.equal("PRIVMSG NickServ :IDENTIFY test password");
                    done();
                }
            });
        });
    });
});
