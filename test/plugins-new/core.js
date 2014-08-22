var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('core.js', function() {
    describe('client.pass()', function () {
        it('should send the server password', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PASS test');
                    done();
                });
            });

            client.pass('test');
        });
    });

    describe('client.user()', function () {
        it('should send the right parameters', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('USER test2 0 * :Testing Client');
                    done();
                });
            });

            client.user('test2', 'Testing Client');
        });
    });

    describe('client.oper()', function () {
        it('should send the right parameters', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('OPER test password');
                    done();
                });
            });

            client.oper('test', 'password');
        });
    });
});
