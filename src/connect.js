import { makeLogger, arrayify, execAll } from './utils'
const { debug } = makeLogger('connect')

import instance from './instance'

/**
 * Create an instance container, which allows handling multiple networks on
 * various protocols.
 *
 * @param  {Object|Array} rawConfig
 * @return {Array}
 */
export default function connect (rawConfig) {
  const config = arrayify(rawConfig)
  debug('connect(' + JSON.stringify(config) + ')')
  const instances = config.map(instance)

  // enhance `instances` array
  instances.on = execAll('on', instances)
  instances.send = execAll('send', instances)
  instances.dispatch = execAll('dispatch', instances)

  return instances
}
