import dude from 'debug-dude'

/**
 * Check if data is an object (and not a function or `null`)
 *
 * @param  {any} data
 * @return {Boolean}
 */
export const isObject = (data) => {
  return data !== null &&
    typeof data === 'object' &&
    !(data instanceof Function)
}

/**
 * A function to map over an object.
 *
 * @param  {Object} obj
 * @param  {Function} fn
 * @return {Object}
 */
export const mapObject = (obj, fn) =>
  Object.keys(obj).reduce(
    (res, key) => {
      const val = obj[key]
      if (isObject(val)) {
        res[key] = fn(val)
      }
      return res
    }, {}
  )

/**
 * Make a `makeLogger` function given a root namespace
 *
 * @param  {String) root namespace
 * @return {Function} makeLogger
 */
export const makeLoggerMaker = (root) => (namespace) => dude(root + ':' + namespace)

/**
 * Make a coffea logger given a namespace
 *
 * @param  {String) namespace
 * @return {Object} of debug, log, info, warn and error functions
 */
export const makeLogger = makeLoggerMaker('coffea')

/**
 * Wrap an object into an array if it isn't already.
 *
 * @param  {Object|Array} maybeArray
 * @return {Array}
 */
export const arrayify = (maybeArray) =>
  Array.isArray(maybeArray) ? maybeArray : [maybeArray]

/**
 * Allows for compatibility with various babel versions when using `require()`.
 * Use like this: `defaultImport(require('...'))` instead of `require('...')`
 *
 * See: http://stackoverflow.com/questions/33505992/babel-6-changes-how-it-exports-default
 * Utility function from `redux-undo-boilerplate`: https://github.com/omnidan/redux-undo-boilerplate/pull/4
 *
 * @param  {Object} module
 * @return {Object} correctly imported module
 */
export function defaultImport (module) {
  if (module.__esModule && module.default) {
    return module.default
  } else {
    return module
  }
}
