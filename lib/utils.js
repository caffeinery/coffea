/*jslint node: true*/
"use strict";

var CoffeaEvent = require('./event');
var Message = require('./parser/Message');

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

exports.emit = function (instance, network, event, data) {
    if (!data) {
        data = {};
    }

    var err;
    // an Error was passed, emit it as error and reset data
    if (data instanceof Error) {
        err = data;
        data = {};
    }

    var event_obj = new CoffeaEvent(instance, network);
    if (data instanceof Message) {
        event_obj._message = data;
    }

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            event_obj[key] = data[key];
        }
    }

    event_obj.name = event;

    var retErr;
    if (err) {
        retErr = instance.emit('error', err, event_obj);
    }

    var ret1 = instance.emit(event, err, event_obj);
    var ret2 = instance.emit(network + ":" + event, err, event_obj);
    var ret3 = instance.emit('event', event, err, event_obj);

    return [ret1, ret2, ret3, retErr]; // Maybe this comes in very handy, I'm not too sure though.
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
    var F = function(){}; // defining temp empty function
    F.prototype = parentClass.prototype;
    F.prototype.constructor = F;

    childClass.prototype = new F();

    childClass.prototype.constructor = childClass; // restoring proper constructor for child class
    parentClass.prototype.constructor = parentClass; // restoring proper constructor for parent class

    childClass.prototype.parent = parentClass.prototype; // store parent
};

/**
 * Internal function to strip a user defined message
 * to make sure it doesn't exceed the maximum size
 *
 * @param  {string}   leading leading string / irc command
 * @param  {string}   msg     user defined message
 * @param  {object}   me      user object
 * @param  {Function} fn
 * @api private
 */
exports.stripMessage = function stripMessage(leading, msg, me, fn) {
    var maxlen = 512 -
                (1 + me.getNick().length + 1 + me.getUsername().length + 1 + me.getHostname().length + 1) -
                leading.length - 2;
    /*jslint regexp: true*/
    msg.match(new RegExp('.{1,' + maxlen + '}', 'g')).forEach(function (str) {
        if (str[0] === ' ') { //leading whitespace
            str = str.substring(1);
        }
        if (str[str.length - 1] === ' ') { //trailing whitespace
            str = str.substring(0, str.length - 1);
        }
        fn(str);
    });
    /*jslint regexp: false*/
};

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
/**
 * Internal function to get param names from a function
 *
 * @param {Function} func  the function you want to get params from
 * @api private
 */
exports.getParamNames = function getParamNames(func) {
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null) {
       result = [];
    }
    return result;
};

/**
 * SSL Error
 *
 * @param {string} message Error message
 * @api private
 */
exports.SSLError = function SSLError(message) {
    this.name = 'SSLError';
    this.message = message || 'SSL Connection Error';
};
exports.SSLError.prototype = new Error();
exports.SSLError.prototype.constructor = exports.SSLError;