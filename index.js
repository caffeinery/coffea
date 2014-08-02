/*jslint node: true*/
"use strict";

var Emitter = require('events').EventEmitter;
var Parser = require('slate-irc-parser');
var replies = require('irc-replies');
var util = require('util');

function toArray(val) {
    return Array.isArray(val) ? val : [val];
}

function Client(stream) {
    if (!(this instanceof Client)) {
        return new Client(stream);
    }
    stream.setEncoding('utf8');
    this.stream = stream;
    this.parser = new Parser();
    this.parser.on('message', this.onmessage.bind(this));
    stream.pipe(this.parser);
    this.setMaxListeners(100);

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

Client.prototype.write = function (str, fn) {
    this.stream.write(str + '\r\n', fn);
};

Client.prototype.pass = function (pass, fn) {
    this.write('PASS ' + pass, fn);
};

Client.prototype.nick = function (nick, fn) {
    if (this.me === null) {
        this.me = this.getUser(nick);
    } else {
        this.me.nick = nick;
    }
    this.write('NICK ' + nick, fn);
};

Client.prototype.user = function (username, realname, fn) {
    this.me.username = username;
    this.me.realname = realname;
    this.write('USER ' + username + ' 0 * :' + realname, fn);
};

Client.prototype.invite = function (name, channel, fn) {
    name = typeof name === "string" ? name : name.getNick();
    this.write('INVITE ' + name + ' ' + channel, fn);
};

Client.prototype.send = function (target, msg) {
    if (typeof target !== "string") {
        if (this.isUser(target)) {
            target = target.getNick();
        } else if (this.isChannel(target)) {
            target = target.getName();
        } else {
            target = target.toString();
        }
    }
    msg = msg.toString();
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
        self.write(leading + str);
    });
    /*jslint regexp: false*/
};

Client.prototype.notice = function (target, msg) {
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
        self.write(leading + str);
    });
    /*jslint regexp: false*/
};

Client.prototype.join = function (channels, fn) {
    this.write('JOIN ' + toArray(channels).join(','), fn);
};

Client.prototype.part = function (channels, msg, fn) {
    if (typeof msg === 'function') {
        fn = msg;
        msg = '';
    }
    this.write('PART ' + toArray(channels).join(',') + ' :' + msg, fn);
};

Client.prototype.topic = function (channel, topic, fn) {
    channel = typeof channel !== "string" ? channel.getName() : channel;
    if (typeof topic === 'function') {
        fn = topic;
        topic = '';
    }
    this.write('TOPIC ' + channel + ' :' + topic, fn);
};

Client.prototype.kick = function (channels, nicks, msg, fn) {
    if (typeof msg === 'function') {
        fn = msg;
        msg = '';
    }
    channels = toArray(channels).join(',');
    nicks = toArray(nicks).join(',');
    this.write('KICK ' + channels + ' ' + nicks + ' :' + msg, fn);
};

Client.prototype.quit = function (msg, fn) {
    msg = msg || 'Bye!';
    this.write('QUIT :' + msg, fn);
};

Client.prototype.oper = function (name, password, fn) {
    this.write('OPER ' + name + ' ' + password, fn);
};

Client.prototype.mode = function (target, flags, params, fn) {
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
        this.write('MODE ' + target + ' ' + flags + ' ' + params, fn);
    } else {
        this.write('MODE ' + target + ' ' + flags, fn);
    }
};

Client.prototype.use = function (fn) {
    fn(this);
    return this;
};

Client.prototype.onmessage = function (msg) {
    msg.command = replies[msg.command] || msg.command;
    this.emit('data', msg);
};