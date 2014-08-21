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

        it('should emit "data" [multi-network]', function (done) {
            var client = coffea();
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('you', st1_id);
            client.nick('me', st2_id);

            client.once("data", function (event) {
                if (event.network === st1_id) {
                    event.prefix.should.equal('hitchcock.freenode.net');
                    event.command.should.equal('NOTICE');
                    event.params.should.equal('*');
                    event.trailing.should.equal('*** Looking up your hostname...');
                    event.string.should.equal(':hitchcock.freenode.net NOTICE * :*** Looking up your hostname...');
                } else {
                    event.prefix.should.equal('hitchcock.freenode.net');
                    event.command.should.equal('NOTICE');
                    event.params.should.equal('*');
                    event.trailing.should.equal('*** No Ident response.');
                    event.string.should.equal(':hitchcock.freenode.net NOTICE * :*** No Ident response.');
                }
                done();
            });

            st1.write(':hitchcock.freenode.net NOTICE * :*** Looking up your hostname...\r\n');
            st2.write(':hitchcock.freenode.net NOTICE * :*** No Ident response.\r\n');
        });

        it('should emit "{network}:data" [multi-network]', function (done) {
            var client = coffea();
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('you', st1_id);
            client.nick('me', st2_id);

            var tests = 0;
            client.once(st1_id + ":data", function (event) {
                event.prefix.should.equal('hitchcock.freenode.net');
                event.command.should.equal('NOTICE');
                event.params.should.equal('*');
                event.trailing.should.equal('*** Looking up your hostname...');
                event.string.should.equal(':hitchcock.freenode.net NOTICE * :*** Looking up your hostname...');
                tests++;
                if(tests >= 2) {
                    done();
                }
            });

            client.once(st2_id + ":data", function (event) {
                event.prefix.should.equal('hitchcock.freenode.net');
                event.command.should.equal('NOTICE');
                event.params.should.equal('*');
                event.trailing.should.equal('*** No Ident response.');
                event.string.should.equal(':hitchcock.freenode.net NOTICE * :*** No Ident response.');
                tests++;
                if(tests >= 2) {
                    done();
                }
            });

            st1.write(':hitchcock.freenode.net NOTICE * :*** Looking up your hostname...\r\n');
            st2.write(':hitchcock.freenode.net NOTICE * :*** No Ident response.\r\n');
        });
    });
});
