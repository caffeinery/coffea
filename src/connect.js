import dude from 'debug-dude'

const {debug} = dude('coffea')

/**
 * Create an instance of coffea which loads a protocol, uses it to connect to a
 * service and then provides events.
 *
 * @param  {Object} config
 * @return {Object}
 */
export default function connect (config) {
  if (!config.protocol || !(typeof config.protocol === 'string' || typeof config.protocol === 'function')) {
    throw new Error('Please pass a string or function as the protocol parameter.')
  }

  let methods = {}
  let listeners = {}

  // Does the protocol exist?
  let protocol

  if (typeof config.protocol === 'function') {
    protocol = config.protocol
  } else {
    try {
      debug(`Attempting to load the protocol coffea-${config.protocol}`)
      protocol = require('coffea-' + config.protocol)
    } catch (e) {
      throw new Error(`The protocol coffea-${config.protocol} isn't installed. We can't use this protocol.`)
    }
  }

  const register = (name, callable) => {
    debug(`Registering the function called "${name}".`)
    methods[name] = callable
  }

  const dispatch = (name, ...params) => {
    debug(`Dispatching event called "${name}".`)

    if (listeners.hasOwnProperty(name)) {
      for (let callback of listeners[name]) {
        callback(...params)
      }
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
