/*jslint node: true*/
"use strict";

var Emitter = require('events').EventEmitter;
var Parser = require('slate-irc-parser');
var replies = require('irc-replies');
var util = require('util');
var utils = require('./lib/utils');

function Client(stream) {
    if (!(this instanceof Client)) {
        return new Client(stream);
    }
    this.setMaxListeners(100);

    this.streams = {};
    this.useStream(stream);

    this.me = null;

    this.use(require('./lib/plugins/server')());
    this.use(require('./lib/plugins/user')());
    this.use(require('./lib/plugins/channel')());

    this.use(require('./lib/plugins/away')());
    this.use(require('./lib/plugins/invite')());
    this.use(require('./lib/plugins/join')());
    this.use(require('./lib/plugins/kick')());
    this.use(require('./lib/plugins/mode')());
    this.use(require('./lib/plugins/motd')());
    this.use(require('./lib/plugins/names')());
    this.use(require('./lib/plugins/nick')());
    this.use(require('./lib/plugins/notice')());
    this.use(require('./lib/plugins/part')());
    this.use(require('./lib/plugins/ping')());
    this.use(require('./lib/plugins/privmsg')());
    this.use(require('./lib/plugins/quit')());
    this.use(require('./lib/plugins/topic')());
    this.use(require('./lib/plugins/welcome')());
    this.use(require('./lib/plugins/whois')());
}

module.exports = Client;

util.inherits(Client, Emitter);

Client.prototype.useStream = function (stream, network) {
    if (network) stream.coffea_id = network; // user-defined stream id
    else stream.coffea_id = Object.keys(this.streams).length.toString(); // assign unique id to stream

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

Client.prototype.write = function (str, network, fn) {
    // if network is the callback, then it wasn't defined either
    if (typeof(network) == 'function') {
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
        if (fn) fn();
    }
};

Client.prototype.pass = function (pass, network, fn) {
    this.write('PASS ' + pass, network, fn);
};

Client.prototype.nick = function (nick, network, fn) {
    if (this.me === null) {
        this.me = this.getUser(nick);
    } else {
        this.me.nick = nick;
    }
    this.write('NICK ' + nick, network, fn);
};

Client.prototype.user = function (username, realname, network, fn) {
    if (this.me === null) this.me = {};
    this.me.username = username;
    this.me.realname = realname;
    this.write('USER ' + username + ' 0 * :' + realname, network, fn);
};

Client.prototype.invite = function (name, channel, network, fn) {
    name = typeof name === "string" ? name : name.getNick();
    this.write('INVITE ' + name + ' ' + channel, network, fn);
};

Client.prototype.send = function (target, msg, network, fn) {
    // if network is the callback, then it wasn't defined either
    // we usually don't need this in every function because client.write does it
    // in this case it's needed because we check for !network later
    if (typeof network === 'function') {
        fn = network;
        network = undefined;
    }

    if (typeof target !== "string") {
        // extract network from channel/user object
        if (!network) network = utils.extractNetwork(target);
        target = utils.targetString(target); // TODO: move this helper function to user/channel plugin?
    }

    var leading, maxlen, _this, message, args = Array.prototype.slice.call(arguments);
    args.shift();
    message = args.join(' ');

    _this = this;
    leading = 'PRIVMSG ' + target + ' :';
    maxlen = 512
            - (1 + this.me.getNick().length + 1 + this.me.getUsername().length + 1 + this.me.getHostname().length + 1)
            - leading.length
            - 2;
    /*jslint regexp: true*/
    message.match(new RegExp('.{1,' + maxlen + '}', 'g')).forEach(function (str) {
        if (str[0] === ' ') { //leading whitespace
            str = str.substring(1);
        }
        if (str[str.length - 1] === ' ') { //trailing whitespace
            str = str.substring(0, str.length - 1);
        }
        _this.write(leading + str, network, fn);
    });
    /*jslint regexp: false*/
};

Client.prototype.notice = function (target, msg, network, fn) {
    if (typeof target !== "string") {
        target = utils.targetString(target);
    }

    var leading, maxlen, _this, message, args = Array.prototype.slice.call(arguments);
    args.shift();
    message = args.join(' ');

    _this = this;
    leading = 'NOTICE ' + target + ' :';
    maxlen = 512
            - (1 + this.me.getNick().length + 1 + this.me.getUsername().length + 1 + this.me.getHostname().length + 1)
            - leading.length
            - 2;
    /*jslint regexp: true*/
    message.match(new RegExp('.{1,' + maxlen + '}', 'g')).forEach(function (str) {
        if (str[0] === ' ') { //leading whitespace
            str = str.substring(1);
        }
        if (str[str.length - 1] === ' ') { //trailing whitespace
            str = str.substring(0, str.length - 1);
        }
        _this.write(leading + str, network, fn);
    });
    /*jslint regexp: false*/
};

Client.prototype.join = function (channels, network, fn) {
    this.write('JOIN ' + utils.toArray(channels).join(','), network, fn);
};

Client.prototype.part = function (channels, msg, network, fn) {
    if (typeof msg === 'function') {
        fn = msg;
        msg = '';
    }
    this.write('PART ' + utils.toArray(channels).join(',') + ' :' + msg, network, fn);
};

Client.prototype.topic = function (channel, topic, network, fn) {
    channel = typeof channel !== "string" ? channel.getName() : channel;
    if (typeof topic === 'function') {
        fn = topic;
        topic = '';
    }
    this.write('TOPIC ' + channel + ' :' + topic, network, fn);
};

Client.prototype.kick = function (channels, nicks, msg, network, fn) {
    if (typeof msg === 'function') {
        fn = msg;
        msg = '';
    }

    channels = utils.toArray(channels).join(',');
    nicks = utils.toArray(nicks).join(',');
    this.write('KICK ' + channels + ' ' + nicks + ' :' + msg, network, fn);
};

Client.prototype.quit = function (msg, network, fn) {
    msg = msg || 'Bye!';
    this.write('QUIT :' + msg, network, fn);
};

Client.prototype.oper = function (name, password, network, fn) {
    this.write('OPER ' + name + ' ' + password, network, fn);
};

Client.prototype.mode = function (target, flags, params, network, fn) {
    if (typeof target !== "string") {
        target = utils.targetString(target);
    }
    if ('function' === typeof params) {
        fn = params;
        params = '';
    }
    if (params) {
        this.write('MODE ' + target + ' ' + flags + ' ' + params, network, fn);
    } else {
        this.write('MODE ' + target + ' ' + flags, network, fn);
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
