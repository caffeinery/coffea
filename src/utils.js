import dude from 'debug-dude'

/**
 * Make a coffea logger given a namespace
 *
 * @param  {String) namespace
 * @return {Object} of debug, log, info, warn and error functions
 */
export const makeLogger = namespace => dude('coffea:' + namespace)

/**
 * Wrap an object into an array if it isn't already.
 *
 * @param  {Object|Array} maybeArray
 * @return {Array}
 */
export const arrayify = maybeArray =>
  Array.isArray(maybeArray) ? maybeArray : [maybeArray]
