/*jslint node: true*/
"use strict";

var Emitter = require('eventemitter3').EventEmitter;
var Parser = require('./lib/parser');
var net = require('net');
var tls = require('tls');
var fs = require('fs');
var replies = require('irc-replies');
var StreamReadable = require('stream').Readable;
var StreamWritable = require('stream').Writable;
var utils = require('./lib/utils');
var RateLimiter = require('limiter').RateLimiter;

/**
 * Client constructor
 *
 * Initializes the client object, sets max listeners,
 * initializes stream buffer and other variables.
 * Then loads plugins and parses the network info passed.
 * Check Client.add for more information about the network info.
 *
 * @class
 * @param {object} info network configuration object
 * @param {bool} throttling enable/disable throttling
 * @property {string} version coffea version
 * @property {object} me client irc user
 */
function Client(info, throttling) {
    if (!(this instanceof Client)) { return new Client(info, throttling); }

    try {
        var pkg = require('./package.json');
        this.version = pkg.version;
    } catch (err) { }

    this.streams = {};
    this.stinfo = {};
    this.networked_me = {};
    this.capabilities = [];

    this._loadPlugins();

    if (typeof info === 'boolean') {
        throttling = info;
        info = null;
    }

    if (throttling !== undefined) {
        this.throttling = throttling;
    }

    if (info) {
        // compatibility
        this.add(info);
    }
}

// expose client
module.exports = Client;

// inherit from Emitter.prototype to make Client and EventEmitter
utils.inherit(Client, Emitter);

/**
 * Internal function that loads all plugins
 * Later this should be replaced with a plugin manager
 *
 * @api private
 */
Client.prototype._loadPlugins = function() {
    var _this = this;
    var files = fs.readdirSync(__dirname + '/lib/plugins/');
    files.forEach(function (file) {
        if (file.substr(-3, 3) === '.js') {
            // console.log('Loading plugin', file);
            _this.use(require(__dirname + '/lib/plugins/' + file)());
        }
    });
};

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

    if (typeof network === 'string') {
        ret.host = network; // super lazy config - a host was passed as a string
    } else {
        ret.host = network.host === undefined ? null : network.host; // Required.
    }

    ret.name = network.name;

    ret.nick = network.nick === undefined ? randnick : network.nick;
    var port = network.ssl === true ? 6697 : 6667;
    ret.port = network.port === undefined ? port : network.port;
    ret.ssl = network.ssl === undefined ? false : network.ssl;
    ret.ssl_allow_invalid = network.ssl_allow_invalid === undefined ? false : network.ssl_allow_invalid;
    ret.username = network.username === undefined ? ret.nick : network.username;
    ret.realname = network.realname === undefined ? ret.nick : network.realname;
    ret.pass = network.pass;

    ret.throttling = network.throttling;

    ret.sasl = network.sasl === undefined? null : network.sasl;
    ret.nickserv = network.nickserv === undefined? null : network.nickserv;

    return ret;
};

/**
 * Internal function that loads a stream into the client
 * Returns specified network name or generated stream id
 *
 * @params {Object} stream      Must be an instanceof StreamReadable and StreamWritable
 * @params {string} network     Specify a network name/stream id
 * @return {string} stream_id
 * @api private
 */
Client.prototype._useStream = function (stream, network, throttling) {
    if (network) { stream.coffea_id = network; } // user-defined stream id
    else { stream.coffea_id = Object.keys(this.streams).length.toString(); } // assign unique id to stream

    stream.setEncoding('utf8'); // set stream encoding
    throttling = ((throttling === undefined) ? this.throttling : throttling);

    // rate limiting/throttling
    stream.limiter = new RateLimiter(1, (typeof throttling === 'number') ? throttling : 250, (throttling === false));

    // set up parser
    var parser = new Parser();
    var _this = this;
    parser.on('message', function (msg) {
        _this.onmessage(msg, stream.coffea_id);
    });
    parser.on('end', function() {
        utils.emit(_this, stream.coffea_id, 'disconnect', {});
    });
    stream.pipe(parser);

    // add stream to client
    this.streams[stream.coffea_id] = stream;
    this.stinfo[stream.coffea_id] = network;

    // return stream id
    return stream.coffea_id;
};

/* Depreciated. This is here for compatibility. */
Client.prototype.useStream = function (stream, network) {
    this._useStream(stream, network);
};

/**
 * Reconnects the socket that is assigned to the current stream_id.
 *
 * @params {string} stream_id
 */
Client.prototype.reconnect = function (stream_id) {
    var network = this.stinfo[stream_id];
    var stream = network.ssl ? tls.connect({host: network.host, port: network.port}) : net.connect({host: network.host, port: network.port});
    this._useStream(stream, stream_id, network.throttling);
    this._connect(stream_id, network);
};

/**
 * Internal function to handle incoming messages from the streams
 *
 * @params {string} msg
 * @api private
 */
Client.prototype.onmessage = function (msg, network) {
    msg.command = replies[msg.command] || msg.command;
    utils.emit(this, network, 'data', msg);
};

Client.prototype._setupSASL = function (stream_id, info) {
    this.on('cap_ack', function (err, event) {
        if (event.capability === 'sasl') {
            this.sasl.mechanism('PLAIN', stream_id);
            if (info.sasl && info.sasl.account && info.sasl.password) {
                this.sasl.login(info.sasl.account, info.sasl.password, stream_id);
            } else if (info.sasl && info.sasl.password) {
                this.sasl.login(info.username, info.sasl.password, stream_id);
            } else {
                this.sasl.login(null, null, stream_id);
            }
        }
    });
};

Client.prototype._connect = function (stream_id, info) {
    this._setupSASL(stream_id, info);
    if (info.pass) { this.pass(info.pass); }
    this.capReq(['account-notify', 'away-notify', 'extended-join', 'sasl'], stream_id);
    this.capEnd(stream_id);
    this.nick(info.nick, stream_id);
    this.user(info.username, info.realname, stream_id);
    if (info.nickserv && info.nickserv.username && info.nickserv.password) {
        this.identify(info.nickserv.username, info.nickserv.password);
    } else if (info.nickserv && info.nickserv.password) {
        this.identify(info.nickserv.password);
    }
};

/**
 * Add a network to the client, the argument can be a stream, network config object
 * or an array of network config objects (see README.md and wiki for more information)
 * Returns specified network name or generated stream id
 *
 * @params {Object} info
 * @return {string} stream_id
 * @api public
 */
Client.prototype.add = function (info) {
    var stream, stream_id, streams = [];
    var _this = this;
    if (info instanceof Array) {
        // We've been passed multiple server information
        info.forEach(function(network) {
            network = _this._check(network);
            if (network.ssl) {
                stream = tls.connect({
                    host: network.host,
                    port: network.port,
                    rejectUnauthorized: !network.ssl_allow_invalid
                }, function() {
                    stream_id = _this._useStream(stream, network.name, network.throttling);
                    utils.emit(_this, stream_id, 'ssl-error', new utils.SSLError(stream.authorizationError));
                    _this._connect(stream_id, network);
                    streams.push(stream_id);
                });
            } else {
                stream = net.connect({host: network.host, port: network.port});
                stream_id = _this._useStream(stream, network.name, network.throttling);
                _this._connect(stream_id, network);
                streams.push(stream_id);
            }
        });
    } else if ((typeof info === 'string') || (info instanceof Object && !(info instanceof StreamReadable) && !(info instanceof StreamWritable))) {
        // We've been passed single server information
        info = _this._check(info);
        if (info.ssl) {
            stream = tls.connect({
                host: info.host,
                port: info.port,
                rejectUnauthorized: !info.ssl_allow_invalid
            }, function() {
                stream_id = _this._useStream(stream, info.name, info.throttling);
                utils.emit(_this, stream_id, 'ssl-error', new utils.SSLError(stream.authorizationError));
                _this._connect(stream_id, info);
            });
        } else {
            stream = net.connect({host: info.host, port: info.port});
            stream_id = _this._useStream(stream, info.name, info.throttling);
            _this._connect(stream_id, info);
        }
    } else {
        // Assume we've been passed the legacy stream.
        stream_id = this._useStream(info, null, info.throttling);
    }

    if(streams.length === 0) {
        return stream_id;
    } else {
        return streams;
    }
};

/**
 * Write data to a specific network (stream)
 *
 * @params {string} str
 * @params {string} network
 * @params {Function} fn
 * @api public
 */
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

    var _this = this;
    if (network && this.streams.hasOwnProperty(network)) {
        // send to specified network
        // this.streams[network].limiter.removeTokens(1, function() {
            _this.streams[network].write(str + '\r\n', fn);
        // });
    } else {
        // send to all networks
        for (var id in this.streams) {
            if (this.streams.hasOwnProperty(id)) {
                this.write(str, id);
            }
        }
        if (fn) {
            fn();
        }
    }

};

/**
 * Load a plugin into the client
 *
 * @params {Function} fn
 * @return {Object} this
 * @api public
 */
Client.prototype.use = function (fn) {
    fn(this);
    return this;
};

/**
 * fallback for `function(event)` callbacks
 *
 * @api private
 */
Client.prototype.fallbackCallback = function fallbackCallback(extend, event, fn, context) {
    var params = utils.getParamNames(fn);
    var func = fn;
    if (params.length === 1) {
        func = function(err, event) {
            fn(event, err);
        };
    }
    extend.call(this, event, func, context);
};

/**
 * apply fallback to `client.on()` events
 *
 * @api private
 */
Client.prototype.on = function on(event, fn, context) {
    this.fallbackCallback(this.parent.on, event, fn, context);
};

/**
 * apply fallback to `client.once()` events
 *
 * @api private
 */
Client.prototype.once = function once(event, fn, context) {
    this.fallbackCallback(this.parent.once, event, fn, context);
};
