import dude from 'debug-dude'

const debug = dude('coffea')

/**
 * Create an instance of coffea which loads a protocol, uses it to connect to a
 * service and then provides events.
 *
 * @param  {Object} config
 * @return {Object}
 */
export function connect (config) {
  if (!config.protocol || typeof config.protocol !== 'string') {
    return new Error('Please pass a protocol to use as a string.')
  }

  let methods = {}
  let listeners = {}

  // Does the protocol exist?
  let protocol

  try {
    debug(`Attempting to load the protocol coffea-${config.protocol}`)
    protocol = require('coffea-' + config.protocol)
  } catch (e) {
    return new Error(`The protocol coffea-${config.protocol} isn't installed. We can't use this protocol.`)
  }

  const register = (name, callable) => {
    debug(`Registering the function called "${name}".`)
    methods[name] = callable
  }

  const dispatch = (name, event) => {
    debug(`Dispatching event called "${name}".`)

    for (let callback of listeners[name]) {
      callback(event)
    }
  }

  protocol(config, register, dispatch)

  return {
    on: (name, callback) => {
      debug(`Listener being subscribed with the name "${name}".`)

      if (listeners[name] === undefined) {
        listeners[name] = [callback]
      } else {
        listeners[name].push(callback)
      }
    },
    call: (method, ...args) => {
      if (methods[method] === undefined) {
        return new Error('The method has not been defined for this protocol.')
      }

      methods[method](...args)
    }
  }
}
