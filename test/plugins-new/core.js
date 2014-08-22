var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('Core Functions', function() {
    describe('client.join()', function () {
        it('should join channels without a password', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('JOIN #test');
                    done();
                });
            });

            client.join('#test');
        });

        it('should join channels with a password', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('JOIN #test test123');
                    done();
                });
            });

            client.join(['#test'], ['test123']);
        });
    });

    describe('client.part()', function () {
        it('should part a channel without a message', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PART #test');
                    done();
                });
            });

            client.part(['#test']);
        });

        it('should part a channel with a message', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PART #test :This channel is boring!');
                    done();
                });
            });

            client.part(['#test'], 'This channel is boring!');
        });
    });

    describe('client.send()', function () {
        it('should send a message to a channel', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PRIVMSG #test :Hello World!');
                    done();
                });
            });

            client.send('#test', 'Hello World!');
        });

        it('should send a message to a person', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PRIVMSG mike :Hello World!');
                    done();
                });
            });

            client.send('mike', 'Hello World!');
        });
    });

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

    describe('client.invite()', function () {
        it('should send an invite', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('INVITE #test mike');
                    done();
                });
            });

            client.invite('#test', 'mike');
        });
    });

    describe('client.kick()', function () {
        it('should kick without a kick message', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('KICK #test mike');
                    done();
                });
            });

            client.kick(['#test'], 'mike');
        });

        it('should kick multiple people without a kick message', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('KICK #test mike,dan');
                    done();
                });
            });

            client.kick(['#test'], ['mike', 'dan']);
        });

        it('should kick with a kick message', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('KICK #test mike :you should know better');
                    done();
                });
            });

            client.kick(['#test'], 'mike', 'you should know better');
        });

        it('should kick multiple people with a kick message', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('KICK #test mike,dan :you should know better');
                    done();
                });
            });

            client.kick(['#test'], ['mike', 'dan'], 'you should know better');
        });
    });

    describe('client.mode()', function () {
        it('should send a mode with parameters', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('MODE #test +bm nick!user@host');
                    done();
                });
            });

            client.mode('#test', '+bm', 'nick!user@host');
        });

        it('should send a mode without parameters', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('MODE #test +i');
                    done();
                });
            });

            client.mode('#test', '+i');
        });
    });

    describe('client.nick()', function () {
        it('should send NICK', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('NICK test2');
                    done();
                });
            });

            client.nick('test2');
        });
    });

    describe('client.notice()', function () {
        it('should send notice to user', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('NOTICE mike :Hi');
                    done();
                });
            });

            client.notice('mike', 'Hi');
        });

        it('should send notice to channel', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('NOTICE #test :Hi');
                    done();
                });
            });

            client.notice('#test', 'Hi');
        });

        it('should send notice to multiple targets', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('NOTICE #test,mike :Hi');
                    done();
                });
            });

            client.notice(['#test', 'mike'], 'Hi');
        });

        it('should send a mass notice [oper-only]', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('NOTICE $$*.freenode.net :[Network Notice] Hi everyone!');
                    done();
                });
            });

            client.notice('$$*.freenode.net', '[Network Notice] Hi everyone!');
        });
    });

    describe('client.quit()', function () {
        it('should send quit without reason', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('QUIT');
                    done();
                });
            });

            client.quit();
        });

        it('should send quit with reason', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('QUIT :See ya soon!');
                    done();
                });
            });

            client.quit("See ya soon!");
        });
    });

    describe('client.topic()', function () {
        it('should change topic', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('TOPIC #test :this is a test channel');
                    done();
                });
            });

            client.topic('#test', 'this is a test channel');
        });

        it('should change topic to nothing', function (done) {
            var client = coffea(false);
            var st1 = new Stream();
            var st1_id = client.add(st1);
            client.nick('test');

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('TOPIC #test :');
                    done();
                });
            });

            client.topic('#test', '');
        });
    });
});
