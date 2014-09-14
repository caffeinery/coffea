/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('Formatting', function() {
    describe('Colours:', function () {
        it('01 : Black', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PRIVMSG #test :\u000301');
                    done();
                });
            });

            client.nick('test');
            client.send('#test', client.format.black);
        });

        it('02 : Navy', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PRIVMSG #test :\u000302');
                    done();
                });
            });

            client.nick('test');
            client.send('#test', client.format.navy);
        });

        it('03 : Green', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PRIVMSG #test :\u000303');
                    done();
                });
            });

            client.nick('test');
            client.send('#test', client.format.green);
        });

        it('04 : Red', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PRIVMSG #test :\u000304');
                    done();
                });
            });

            client.nick('test');
            client.send('#test', client.format.red);
        });

        it('05 : Brown', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PRIVMSG #test :\u000305');
                    done();
                });
            });

            client.nick('test');
            client.send('#test', client.format.brown);
        });

        it('06 : Purple', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PRIVMSG #test :\u000306');
                    done();
                });
            });

            client.nick('test');
            client.send('#test', client.format.purple);
        });

        it('07 : Olive', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PRIVMSG #test :\u000307');
                    done();
                });
            });

            client.nick('test');
            client.send('#test', client.format.olive);
        });

        it('08 : Yellow', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PRIVMSG #test :\u000308');
                    done();
                });
            });

            client.nick('test');
            client.send('#test', client.format.yellow);
        });

        it('09 : Lime', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PRIVMSG #test :\u000309');
                    done();
                });
            });

            client.nick('test');
            client.send('#test', client.format.lime);
        });

        it('10 : teal', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PRIVMSG #test :\u000310');
                    done();
                });
            });

            client.nick('test');
            client.send('#test', client.format.teal);
        });

        it('11 : Aqua', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PRIVMSG #test :\u000311');
                    done();
                });
            });

            client.nick('test');
            client.send('#test', client.format.aqua);
        });

        it('12 : Blue', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PRIVMSG #test :\u000312');
                    done();
                });
            });

            client.nick('test');
            client.send('#test', client.format.blue);
        });

        it('13 : Pink', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PRIVMSG #test :\u000313');
                    done();
                });
            });

            client.nick('test');
            client.send('#test', client.format.pink);
        });

        it('14 : Dark Gray', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PRIVMSG #test :\u000314');
                    done();
                });
            });

            client.nick('test');
            client.send('#test', client.format.dgray);
        });

        it('15 : Light Gray', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PRIVMSG #test :\u000315');
                    done();
                });
            });

            client.nick('test');
            client.send('#test', client.format.lgray);
        });

        it('16 : White', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PRIVMSG #test :\u000316');
                    done();
                });
            });

            client.nick('test');
            client.send('#test', client.format.white);
        });
    });
    describe('Formatters:', function () {
        it('Bold', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PRIVMSG #test :\u0002');
                    done();
                });
            });

            client.nick('test');
            client.send('#test', client.format.bold);
        });

        it('Normal', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PRIVMSG #test :\u000f');
                    done();
                });
            });

            client.nick('test');
            client.send('#test', client.format.normal);
        });

        it('Italics', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PRIVMSG #test :\u0016');
                    done();
                });
            });

            client.nick('test');
            client.send('#test', client.format.italic);
        });

        it('Underline', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PRIVMSG #test :\u001f');
                    done();
                });
            });

            client.nick('test');
            client.send('#test', client.format.underline);
        });

        it('Reset Formatting/Colour', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st1_id = client.add(st1);

            client.once('data', function (data) {
                client.once('data', function (data) {
                    data.string.should.equal('PRIVMSG #test :\u000300\u000f');
                    done();
                });
            });

            client.nick('test');
            client.send('#test', client.format.reset);
        });
    });
});
