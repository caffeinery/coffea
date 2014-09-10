/*jslint node: true*/
/*jslint expr: true*/
/*global describe, it*/
"use strict";

var coffea = require('../..');
var Stream = require('stream').PassThrough;
var should = require('should');

describe('index.js', function() {
    describe('version', function() {
        it('should return coffea version', function() {
            var client = coffea(null, false);

            should.exist(client.version);
        });
    });
});