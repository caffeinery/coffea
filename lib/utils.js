/*jslint node: true*/
"use strict";

/**
 * Parse channel list `str`.
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */

exports.channelList = function (str) {
    return str.split(',').map(function (chan) {
        return chan.toLowerCase();
    });
};

/**
 * Parse nick from `msg`.
 *
 * @param {Object} msg
 * @return {String}
 * @api private
 */

exports.nick = function (msg) {
    return msg.prefix.split('!')[0];
};

/**
 * Emit the relevant events.
 *
 * @param {Object} instance
 * @param {String} network
 * @param {String} event
 * @param {Object} data
 * @return {Array} Array of Booleans - `true` if event has listeners. `false` otherwise.
 * @api private
 */

exports.emit = function(instance, network, event, data) {
	var ret1, ret2;
	ret1 = instance.emit(event, data);
	ret2 = instance.emit(network + ":" + event, data);
	return [ret1, ret2]; // Matbe this comes in very handy, I'm not too sure though.
};