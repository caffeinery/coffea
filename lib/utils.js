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
