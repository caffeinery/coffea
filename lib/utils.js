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
 * @param {Error} err
 * @return {Array} Array of Booleans - `true` if event has listeners. `false` otherwise.
 * @api private
 */

exports.emit = function(instance, network, event, data, err) {
	var ret1, ret2;

  if (!data) data = {};

  // an Error was passed, emit it as error and reset data
  if (data instanceof Error) {
    err = data;
    data = {};
  }

	data.network = network; // Why not add it here? Makes sense instead of repeating code :D

	ret1 = instance.emit(event, data, err);
	ret2 = instance.emit(network + ":" + event, data, err);
	return [ret1, ret2]; // Matbe this comes in very handy, I'm not too sure though.
};

/**
 * Convert to array
 *
 * @param {String} val
 * @return {Array}
 * @api private
 */
exports.toArray = function (val) {
    return Array.isArray(val) ? val : [val];
};

/**
 * Extract network from User/Channel object
 *
 * @param {Object} target
 * @return {String}
 * @api private
 */
exports.extractNetwork = function (target) {
    if (typeof target.getNetwork === 'function') {
        return target.getNetwork();
    } else return;
};

/**
 * Convert target object to string
 *
 * @param {Object} target
 * @return {String}
 * @api private
 */
exports.targetString = function (target) {
  if (target.client) {
    if (target.client.isUser(target)) {
        return target.getNick();
    } else if (target.client.isChannel(target)) {
        return target.getName();
    } else {
      return target.toString();
    }
  }
  return target;
};

/**
 * Merge the contents of two objects together into the first object.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api private
 */
exports.extend = function(a, b) {
    for (var prop in b) {
	a[prop] = b[prop];
    }
    return a;
}
