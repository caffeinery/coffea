import dude from 'debug-dude'

/**
 * Higher-order function that creates a function that will execute `func` on all
 * `objects` with the given arguments.
 *
 * @param  {Object|Array} rawConfig
 * @return {Array}
 */
export const execAll = (func, objects) => (...args) => {
  objects.forEach(
    (obj) => obj[func](...args)
  )
}

/**
 * Make a coffea logger given a namespace
 *
 * @param  {String) namespace
 * @return {Object} of debug, log, info, warn and error functions
 */
export const makeLogger = (namespace) => dude('coffea:' + namespace)

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
export default function defaultImport (module) {
  if (module.__esModule && module.default) {
    return module.default
  } else {
    return module
  }
}
