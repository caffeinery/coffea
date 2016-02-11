import { makeLogger, arrayify } from './utils'
const { debug } = makeLogger('connect')

import instance from './instance'

/**
 * Create an instance container, which allows handling multiple networks on
 * various protocols.
 *
 * @param  {Object|Array} rawConfig
 * @return {Array}
 */
export default const connect = rawConfig => {
  const config = arrayify(rawConfig)
  debug('connect(' + JSON.stringify(config) + ')')
  const instances = config.map(instance)

  // TODO: enhance `instances` array with `.on` and `.send`

  return instances
}
