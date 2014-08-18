var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('join.js', function() {
    describe('on JOIN', function() {
        it('should emit "join" [single-network]', function (done) {
            var client = coffea();
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('foo', st1_id);

            client.once("join", function (event) {
                event.user.getNick().should.equal('foo');
                event.channel.should.equal('#baz');
                done();
            });

            st1.write(':foo!bar@baz.com JOIN #baz\r\n');
        });

        it('should emit "join" [multi-network]', function (done) {
            var client = coffea();
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('ChanServ', st1_id);
            client.nick('foo', st2_id);

            client.once("join", function (event) {
                if (event.network === st1_id) {
                    event.user.getNick().should.equal('ChanServ');
                    event.channel.should.equal('#servies');
                } else {
                    event.user.getNick().should.equal('foo');
                    event.channel.should.equal('#baz');
                }
                done();
            });

            st1.write(':ChanServ!ChanServ@services.in JOIN #services\r\n');
            st1.write(':foo!bar@baz.com JOIN #baz\r\n');
        });

        it('should emit "{network}:join" [multi-network]', function (done) {
            var client = coffea();
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);
            var st2_id = client.add(st2);
            client.nick('ChanServ', st1_id);
            client.nick('foo', st2_id);

            var tests = 0;
            client.once(st1_id + ":join", function (event) {
                event.user.getNick().should.equal('ChanServ');
                event.channel.should.equal('#servies');
                tests++;
                if(tests >= 2) {
                    done();
                }
            });

            client.once(st2_id + ":join", function (event) {
                event.user.getNick().should.equal('foo');
                event.channel.should.equal('#baz');
                tests++;
                if(tests >= 2) {
                    done();
                }
            });

            st1.write(':ChanServ!ChanServ@services.in JOIN #services\r\n');
            st1.write(':foo!bar@baz.com JOIN #baz\r\n');
        });
    });
});
