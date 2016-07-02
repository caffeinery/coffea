import { makeLogger, arrayify, mapObject } from './utils'
const { debug } = makeLogger('connect')

import instance from './instance'

/**
 * Higher-order function that creates a function that will execute `func` on all
 * `instances` with the given arguments.
 *
 * @param  {Function} func
 * @param  {Object|Array} instances
 * @return {Array}
 */
const execAll = (func, instances) => (...args) => {
  const mappingFn = (obj) => obj[func](...args)

  let functions
  if (Array.isArray(instances)) functions = instances.map(mappingFn)
  else functions = mapObject(instances, mappingFn)

  return () => functions.forEach((f) => f())
}

/**
 * Enhance instances container with `on`, `send` and `dispatch` functions
 *
 * @param {Object|Array} instances
 * @return {Object|Array}
 */
const enhanceInstances = (instances) => {
  // enhance `instances` container
  instances.on = execAll('on', instances)
  instances.send = execAll('send', instances)
  instances.dispatch = execAll('dispatch', instances)
  return instances
}

/**
 * Create an instance container, which allows handling multiple networks on
 * various protocols.
 *
 * You can pass:
 *  - a single config object (will return an array with a single instance)
 *  - an array of config objects (will return an array with instances)
 *  - an object of config objects (will return an object of instances)
 *
 * @param  {Object|Array} rawConfig
 * @return {Object|Array}
 */
export default function connect (rawConfig) {
  debug('connect(' + JSON.stringify(rawConfig) + ')')

  let instances
  if (Array.isArray(rawConfig)) { // array of configs
    instances = rawConfig.map(instance)
  } else if (rawConfig.hasOwnProperty('protocol')) { // single config
    instances = arrayify(instance(rawConfig))
  } else { // object of configs
    instances = mapObject(rawConfig, instance)
  }

  if (
    (Array.isArray(instances) && instances.length === 0) ||
    (Object.keys(instances).length === 0)
  ) throw new Error('no config/s defined')

  return enhanceInstances(instances)
}
