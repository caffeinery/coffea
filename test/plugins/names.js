/*jslint node: true*/
/*global describe, it*/
"use strict";

var irc = require('../..');
var Stream = require('stream').PassThrough;

describe('names()', function () {
    describe('client.names(chan, fn)', function () {
        it('should respond with user names', function (done) {
            var stream = new Stream(),
                client = irc(stream);
            client.nick('maggin');

            client.names('#foo', function (names) {
                names.should.eql({
                    "Ditti": [],
                    "pot": [],
                    "maggin": [],
                    "Joshua": [],
                    "coleytab": [],
                    "SteveJobs": [],
                    "SSL": [],
                    "dan": [],
                    "Krystal": [],
                    "Ares": [],
                    "hdrv": [],
                    "Stats": [],
                    "pupskuchen": ['~', '@'],
                    "TokeBot": [],
                    "Coley": ['@'],
                    "cock": [],
                    "FapBot": [],
                    "benvei": [],
                    "GLaDOS": [],
                    "KeratBot": []
                });
                done();
            });

            setImmediate(function () {
                stream.write(':vulcanus.kerat.net 353 maggin @ #foo :Ditti pot maggin Joshua coleytab SteveJobs SSL dan Krystal Ares hdrv Stats ~@pupskuchen\r\n');
                stream.write(':vulcanus.kerat.net 353 maggin @ #foo :TokeBot @Coley cock FapBot benvei GLaDOS KeratBot\r\n');
                stream.write(':vulcanus.kerat.net 366 maggin #foo :End of /NAMES list.\r\n');
            });
        });
    });

    it('should emit "names"', function (done) {
        var stream = new Stream(),
            client = irc(stream);
        client.nick('foo');

        client.on('names', function (event) {
            event.channel.getName().should.equal('#foo');
            event.names.should.eql({
                "Ditti": [],
                "pot": [],
                "maggin": [],
                "Joshua": [],
                "coleytab": [],
                "SteveJobs": [],
                "SSL": [],
                "dan": [],
                "Krystal": [],
                "Ares": [],
                "hdrv": [],
                "Stats": [],
                "pupskuchen": ['~', '@'],
                "TokeBot": [],
                "Coley": ['@'],
                "cock": [],
                "FapBot": [],
                "benvei": [],
                "GLaDOS": [],
                "KeratBot": []
            });
            done();
        });

        stream.write(':foo!bar@baz.com JOIN :#dev\r\n');
        stream.write(':vulcanus.kerat.net 353 foo @ #foo :Ditti pot maggin Joshua coleytab SteveJobs SSL dan Krystal Ares hdrv Stats ~@pupskuchen\r\n');
        stream.write(':vulcanus.kerat.net 353 foo @ #foo :TokeBot @Coley cock FapBot benvei GLaDOS KeratBot\r\n');
        stream.write(':vulcanus.kerat.net 366 foo #foo :End of /NAMES list.\r\n');
    });
});