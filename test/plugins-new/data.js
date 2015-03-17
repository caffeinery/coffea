/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../..');
var Stream = require('stream').PassThrough;

describe('data.js', function() {
    describe('on DATA', function() {
        it('should emit "data" [single-network]', function (done) {
            var client = coffea(null, false);
            var st1 = new Stream();
            var st2 = new Stream();
            var st1_id = client.add(st1);

            client.once("data", function() { // nick event
                client.once("data", function (err, event) {
                    event.prefix.should.equal('hitchcock.freenode.net');
                    event.command.should.equal('NOTICE');
                    event.params.should.equal('*');
                    event.trailing.should.equal('*** Looking up your hostname...');
                    event.string.should.equal(':hitchcock.freenode.net NOTICE * :*** Looking up your hostname...');
                    done();
                });
            });

            client.nick('me', st1_id);
            st1.write(':hitchcock.freenode.net NOTICE * :*** Looking up your hostname...\r\n');
        });
    });
});
