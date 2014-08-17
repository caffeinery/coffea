/*jslint node: true*/
"use strict";

var Event = require('./plugins/event');

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

exports.emit = function (instance, network, event, data, err) {
  	var ret1, ret2;

    if (!data) {
        data = {};
    }

    // an Error was passed, emit it as error and reset data
    if (data instanceof Error) {
      err = data;
      data = {};
    }

    var event_obj = new Event(network);
    for (var key in data) {
      event_obj[key] = data[key];
    }

  	ret1 = instance.emit(event, event_obj, err);
  	ret2 = instance.emit(network + ":" + event, event_obj, err);
  	return [ret1, ret2]; // Maybe this comes in very handy, I'm not too sure though.
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
exports.extractNetwork = function extractNetwork(target) {
    if (typeof target.getNetwork === 'function') {
        return target.getNetwork();
    } else {
        return;
    }
};

/**
 * Convert target object to string
 *
 * @param {Object} target
 * @return {String}
 * @api private
 */
exports.targetString = function targetString(target) {
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
 * Parse target string/object
 * @param  {object|string} target_raw
 * @return {object} {network: string, target: string}
 */
exports.parseTarget = function (target_raw) {
    var target, network;
    if (typeof target_raw !== "string") {
        // extract network from channel/user object
        network = exports.extractNetwork(target_raw);
        target = exports.targetString(target_raw);
    } else {
        if (target_raw.indexOf(':') > -1) {
            var splits = target_raw.split(':');
            if (splits.length > 1) {
                network = splits[0];
                target = splits[1];
            }
        } else {
            target = target_raw;
        }
    }

    return {network: network, target: target};
};

/**
 * Merge the contents of two objects together into the first object.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api private
 */
exports.extend = function (a, b) {
    for (var prop in b) {
        if (b.hasOwnProperty(prop)) {
	       a[prop] = b[prop];
        }
    }
    return a;
};

/**
 * Inherit a class
 *
 * @param {Function} childClass
 * @param {Function} parentClass
 * @api private
 */
exports.inherit = function (childClass, parentClass) {
    var F=function(){}; // defining temp empty function
    F.prototype=parentClass.prototype;
    F.prototype.constructor=F;

    childClass.prototype=new F();

    childClass.prototype.constructor=childClass; // restoring proper constructor for child class
    parentClass.prototype.constructor=parentClass; // restoring proper constructor for parent class
};
