/*jslint node: true*/
"use strict";

function Event(network) {
    this.network = network;
};

module.exports = Event;

Event.prototype.reply = function reply(message) {
	if (this.channel || this.user) {
    	return this.client.send(this.channel ? this.channel : this.user, message, this.network);
    }
};