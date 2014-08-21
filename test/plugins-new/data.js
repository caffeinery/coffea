var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('data.js', function() {
    describe('on DATA', function() {
        it('should emit "data" [single-network]', function (done) {
            var client = coffea();
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            client.nick('me', st1_id);

            client.once("data", function (event) {
                event.prefix.should.equal('hitchcock.freenode.net');
                event.command.should.equal('NOTICE');
                event.params.should.equal('*');
                event.trailing.should.equal('*** Looking up your hostname...');
                event.string.should.equal(':hitchcock.freenode.net NOTICE * :*** Looking up your hostname...');
                done();
            });

            st1.write(':hitchcock.freenode.net NOTICE * :*** Looking up your hostname...\r\n');
        });
    });
});
