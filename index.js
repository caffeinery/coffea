/*jslint node: true*/
"use strict";

var Emitter = require('events').EventEmitter;
var Parser = require('slate-irc-parser');
var net = require('net');
var replies = require('irc-replies');
var util = require('util');
var Stream = require('stream').PassThrough;

function toArray(val) {
    return Array.isArray(val) ? val : [val];
}


function Client(info) {
    if (!(this instanceof Client)) {
        return new Client(info);
    }
    this.setMaxListeners(100);

    this.streams = {};
    this.me = null;

    if (info instanceof Array) {
        // We've been passed multiple server information
        info.forEach(function(network) {
            stream = net.connect({host: network.host, port: network.port});
            this.useStream(stream, network.name);
        });
    } else if (info instanceof Object && !(info instanceof net.Socket) && !(info instanceof Stream)) {
        // We've been passed single server information
        stream = net.connect({host: info.host, port: info.port});
        this.useStream(stream, info.name);
    } else {
        // Assume we've been passed the legacy stream.
        this.useStream(info);
    }

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

Client.prototype.useStream = function (stream, stream_id) {
    if (stream_id) stream.coffea_id = stream_id; // user-defined stream id
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

// TODO: plugins should have multi-network support too. identify networks by
//       stream.coffea_id and stream_id passed with on('data')

Client.prototype.write = function (str, stream_id, fn) {
    if (typeof(stream_id) == 'function') {
      fn = stream_id;
      stream_id = undefined;
    }

    // somebody passed the stream, not the id, get id from stream
    if (stream_id !== null && typeof stream_id === 'object') {
      stream_id = stream_id.coffea_id;
    }

    if (stream_id && this.streams.hasOwnProperty(stream_id)) {
      this.streams[stream_id].write(str + '\r\n', fn);
    } else {
      for (var id in this.streams) {
        if (this.streams.hasOwnProperty(id)) {
          this.streams[id].write(str + '\r\n');
        }
      }
      if (fn) fn();
    }
};

Client.prototype.pass = function (pass, stream_id, fn) {
    this.write('PASS ' + pass, stream_id, fn);
};

Client.prototype.nick = function (nick, stream_id, fn) {
    if (this.me === null) {
        this.me = this.getUser(nick);
    } else {
        this.me.nick = nick;
    }
    this.write('NICK ' + nick, stream_id, fn);
};

Client.prototype.user = function (username, realname, stream_id, fn) {
    this.me.username = username;
    this.me.realname = realname;
    this.write('USER ' + username + ' 0 * :' + realname, stream_id, fn);
};

Client.prototype.invite = function (name, channel, stream_id, fn) {
    name = typeof name === "string" ? name : name.getNick();
    this.write('INVITE ' + name + ' ' + channel, stream_id, fn);
};

Client.prototype.send = function (target, msg, stream_id, fn) {
    if (typeof stream_id === "function") {
        fn = stream_id;
        stream_id = null;
        network = target.split(':')[0];
        channel = target.split(':')[1];

        this.send(channel, msg, network, fn);
    } else {
        if (typeof target !== "string") {
            if (this.isUser(target)) {
                target = target.getNick();
            } else if (this.isChannel(target)) {
                target = target.getName();
            } else {
                target = target.toString();
            }
        }
        var leading, maxlen, self;
        self = this;
        leading = 'PRIVMSG ' + target + ' :';
        maxlen = 512
                - (1 + this.me.getNick().length + 1 + this.me.getUsername().length + 1 + this.me.getHostname().length + 1)
                - leading.length
                - 2;
        /*jslint regexp: true*/
        msg.match(new RegExp('.{1,' + maxlen + '}', 'g')).forEach(function (str) {
            if (str[0] === ' ') { //leading whitespace
                str = str.substring(1);
            }
            if (str[str.length - 1] === ' ') { //trailing whitespace
                str = str.substring(0, str.length - 1);
            }
            self.write(leading + str, stream_id, fn);
        });
        /*jslint regexp: false*/
    }
};

Client.prototype.notice = function (target, msg, stream_id, fn) {
    if (typeof target !== "string") {
        if (this.isUser(target)) {
            target = target.getNick();
        } else if (this.isChannel(target)) {
            target = target.getName();
        } else {
            target = target.toString();
        }
    }
    var leading, maxlen, self;
    self = this;
    leading = 'NOTICE ' + target + ' :';
    maxlen = 512
            - (1 + this.me.getNick().length + 1 + this.me.getUsername().length + 1 + this.me.getHostname().length + 1)
            - leading.length
            - 2;
    /*jslint regexp: true*/
    msg.match(new RegExp('.{1,' + maxlen + '}', 'g')).forEach(function (str) {
        if (str[0] === ' ') { //leading whitespace
            str = str.substring(1);
        }
        if (str[str.length - 1] === ' ') { //trailing whitespace
            str = str.substring(0, str.length - 1);
        }
        self.write(leading + str, stream_id, fn);
    });
    /*jslint regexp: false*/
};

Client.prototype.join = function (channels, stream_id, fn) {
    if (typeof(stream_id) == 'function') {
      fn = stream_id;
      stream_id = undefined;
    }
    this.write('JOIN ' + toArray(channels).join(','), stream_id, fn);
};

Client.prototype.part = function (channels, msg, stream_id, fn) {
    if (typeof(stream_id) == 'function') {
      fn = stream_id;
      stream_id = undefined;
    }
    if (typeof msg === 'function') {
        fn = msg;
        msg = '';
    }
    this.write('PART ' + toArray(channels).join(',') + ' :' + msg, stream_id, fn);
};

Client.prototype.topic = function (channel, topic, stream_id, fn) {
    if (typeof(stream_id) == 'function') {
      fn = stream_id;
      stream_id = undefined;
    }
    channel = typeof channel !== "string" ? channel.getName() : channel;
    if (typeof topic === 'function') {
        fn = topic;
        topic = '';
    }
    this.write('TOPIC ' + channel + ' :' + topic, stream_id, fn);
};

Client.prototype.kick = function (channels, nicks, msg, stream_id, fn) {
    if (typeof(stream_id) == 'function') {
      fn = stream_id;
      stream_id = undefined;
    }
    if (typeof msg === 'function') {
        fn = msg;
        msg = '';
    }
    channels = toArray(channels).join(',');
    nicks = toArray(nicks).join(',');
    this.write('KICK ' + channels + ' ' + nicks + ' :' + msg, stream_id, fn);
};

Client.prototype.quit = function (msg, stream_id, fn) {
    if (typeof(stream_id) == 'function') {
      fn = stream_id;
      stream_id = undefined;
    }
    msg = msg || 'Bye!';
    this.write('QUIT :' + msg, stream_id, fn);
};

Client.prototype.oper = function (name, password, stream_id, fn) {
    if (typeof(stream_id) == 'function') {
      fn = stream_id;
      stream_id = undefined;
    }
    this.write('OPER ' + name + ' ' + password, stream_id, fn);
};

Client.prototype.mode = function (target, flags, params, stream_id, fn) {
    if (typeof(stream_id) == 'function') {
      fn = stream_id;
      stream_id = undefined;
    }
    if (typeof target !== "string") {
        if (this.isUser(target)) {
            target = target.getNick();
        } else if (this.isChannel(target)) {
            target = target.getName();
        } else {
            target = target.toString();
        }
    }
    if ('function' === typeof params) {
        fn = params;
        params = '';
    }
    if (params) {
        this.write('MODE ' + target + ' ' + flags + ' ' + params, stream_id, fn);
    } else {
        this.write('MODE ' + target + ' ' + flags, stream_id, fn);
    }
};

Client.prototype.use = function (fn) {
    fn(this);
    return this;
};

Client.prototype.onmessage = function (msg, stream_id) {
    msg.command = replies[msg.command] || msg.command;
    this.emit('data', msg, stream_id);
};
