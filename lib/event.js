/*jslint node: true*/
"use strict";

function Event(irc, network) {
    this.irc = irc;
    this.network = network;

    // hide `client` property
    Object.defineProperty(this, 'irc', {
        enumerable: false,
        writable: true
    });
}

module.exports = Event;

Event.prototype.getMessage = function getMessage() {
    return this._message;
};

Event.prototype.reply = function reply(message) {
	return this._reply("send", message);
};

Event.prototype.replyAction = function reply(message) {
	return this._reply("action", message);
};

Event.prototype.replyNotice = function reply(message) {
	return this._reply("notice", message);
};

Event.prototype._reply = function _reply(action, message) {
    if (this.channel || this.user) {
        var fn = this.irc[action];
        if (typeof fn === 'function') {
            fn = fn.bind(this.irc);
            return fn(this.channel ? this.channel : this.user, message, this.network);
        }
    }
};