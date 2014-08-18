/*jslint node: true*/
"use strict";

var Emitter = require('events').EventEmitter;
var Parser = require('slate-irc-parser');
var net = require('net');
var tls = require('tls');
var replies = require('irc-replies');
var StreamReadable = require('stream').Readable;
var StreamWritable = require('stream').Writable;
var utils = require('./lib/utils');

function Client(info) {
    if (!(this instanceof Client)) { return new Client(info); }
    this.setMaxListeners(100);

    this.streams = {};
    this.me = null;

    this.use(require('./lib/plugins/core')());

    this.use(require('./lib/plugins/server')());
    this.use(require('./lib/plugins/user')());
    this.use(require('./lib/plugins/channel')());

    this.use(require('./lib/plugins/away')());
    this.use(require('./lib/plugins/format')());
    this.use(require('./lib/plugins/invite')());
    this.use(require('./lib/plugins/join')());
    this.use(require('./lib/plugins/kick')());
    this.use(require('./lib/plugins/mode')());
    this.use(require('./lib/plugins/motd')());
    this.use(require('./lib/plugins/names')());
    this.use(require('./lib/plugins/nick')());
    this.use(require('./lib/plugins/notice')());
    this.use(require('./lib/plugins/part')());
    this.use(require('./lib/plugins/pong')());
    this.use(require('./lib/plugins/privmsg')());
    this.use(require('./lib/plugins/quit')());
    this.use(require('./lib/plugins/topic')());
    this.use(require('./lib/plugins/welcome')());
    this.use(require('./lib/plugins/whois')());
    this.use(require('./lib/plugins/errors')());

    if (info) this.add(info);
}

// expose client
module.exports = Client;

// inherit from Emitter.prototype to make Client and EventEmitter
utils.inherit(Client, Emitter);

/**
 * Internal function that does a sanity check
 * on the network information, adding defaults
 * 
 * @params {Object} network
 * @return {Object} network
 * @api private
 */
Client.prototype._check = function(network) {
    var ret = {};
    var randnick = "coffea"+Math.floor(Math.random() * 100000);

    ret.host = network.host === undefined ? null : network.host; // Required.

    ret.name = network.name;
    
    ret.nick = network.nick === undefined ? randnick : network.nick;
    ret.port = network.port === undefined ? 6667 : network.port;
    ret.ssl = network.ssl === undefined ? false : network.ssl;
    ret.username = network.username === undefined ? ret.nick : network.username;
    ret.realname = network.realname === undefined ? ret.nick : network.realname;
    ret.pass = network.pass;

    return ret;
};

Client.prototype._useStream = function (stream, network) {
    if (network) { stream.coffea_id = network; } // user-defined stream id
    else { stream.coffea_id = Object.keys(this.streams).length.toString(); } // assign unique id to stream

    stream.setEncoding('utf8'); // set stream encoding

    // set up parser
    var parser = new Parser();
    var _this = this;
    parser.on('message', function (msg) {
        _this.onmessage(msg, stream.coffea_id);
    });
    stream.pipe(parser);

    // add stream to client
    this.streams[stream.coffea_id] = stream;

    // return stream id
    return stream.coffea_id;
};

/* Depreciated. This is here for compatibility. */
Client.prototype.useStream = function (stream, network) {
    this._useStream(stream, network);
};

Client.prototype.add = function (info) {
    var stream, stream_id;
    if (info instanceof Array) {
        // We've been passed multiple server information
        var _this = this;
        info.forEach(function(network) {
            network = _this._check(network);
            if (!network.ssl) {
                stream = net.connect({host: network.host, port: network.port});
            } else {
                stream = tls.connect({host: network.host, port: network.port});
            }
            stream_id = _this._useStream(stream, network.name);
            if (network.pass) { _this.pass(network.pass); }
            _this.nick(network.nick);
            _this.user(network.username, network.realname);
            if(network.nickserv.username && network.nickserv.password) {
                _this.identify(network.nickserv.username, network.nickserv.password);
            } else if (network.nickserv.password) {
                _this.identify(network.nickserv.password);
            }
        });
    } else if (info instanceof Object && !(info instanceof StreamReadable) && !(info instanceof StreamWritable)) {
        // We've been passed single server information
        info = this._check(info);
        if (!info.ssl) {
            stream = net.connect({host: info.host, port: info.port});
        } else {
            stream = tls.connect({host: info.host, port: info.port});
        }
        stream_id = this._useStream(stream, info.name);
        if(info.pass) { this.pass(info.pass); }
        this.nick(info.nick);
        this.user(info.username, info.realname);
        if(info.nickserv.username && info.nickserv.password) {
            this.identify(info.nickserv.username, info.nickserv.password);
        } else if (info.nickserv.password) {
            this.identify(info.nickserv.password);
        }
    } else {
        // Assume we've been passed the legacy stream.
        stream_id = this._useStream(info);
    }

    return stream_id;
};

Client.prototype.write = function (str, network, fn) {
    // if network is the callback, then it wasn't defined either
    if (typeof(network) === 'function') {
        fn = network;
        network = undefined;
    }

    // somebody passed the stream, not the id, get id from stream
    if (network !== null && typeof network === 'object') {
        network = network.coffea_id;
    }

    if (network && this.streams.hasOwnProperty(network)) {
        this.streams[network].write(str + '\r\n', fn);
    } else {
        for (var id in this.streams) {
            if (this.streams.hasOwnProperty(id)) {
                this.streams[id].write(str + '\r\n');
            }
        }
        if (fn) { fn(); }
    }
};

Client.prototype.use = function (fn) {
    fn(this);
    return this;
};

Client.prototype.onmessage = function (msg, network) {
    msg.command = replies[msg.command] || msg.command;
    this.emit('data', msg, network);
};
