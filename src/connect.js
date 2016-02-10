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

  let protocol, handler

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

  const dispatch = (event) => {
    const { type } = event
    debug(`Dispatching "${type}" event.`)

    // always dispatch `event` (wildcard) event
    if (listeners.hasOwnProperty('event')) {
      for (let callback of listeners['event']) {
        callback(event, handler)
      }
    }

    // dispatch certain event type
    if (listeners.hasOwnProperty(type)) {
      for (let callback of listeners[type]) {
        callback(event, handler)
      }
    }
  }

  handler = protocol(config, dispatch)

  return {
    on: (name, callback) => {
      debug(`Listener being subscribed with the name "${name}".`)

      if (listeners[name] === undefined) {
        listeners[name] = [callback]
      } else {
        listeners[name].push(callback)
      }
    },
    send: handler
  }
}
