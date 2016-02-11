import { makeLogger } from './utils'
const { debug } = makeLogger('instance')

/**
 * Higher-order function to make a `dispatch` function given a `listeners`
 * object and a `handler`, which will handle calling events sent to the protocol.
 *
 * @private
 * @param  {Object} listeners
 * @return {Function} dispatch
 */
const makeDispatch = (listeners, getHandler) => event => {
  const handler = getHandler()

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

/**
 * Higher-order function to make an `on` function given a `listeners` object.
 *
 * @private
 * @param  {Object} listeners
 * @return {Function} on
 */
const makeOn = listeners => (name, callback) => {
  debug(`Listener being subscribed with the name "${name}".`)

  if (listeners[name] === undefined) {
    listeners[name] = [callback]
  } else {
    listeners[name].push(callback)
  }
}

/**
 * Load a coffea protocol (`coffea-PROTOCOLNAME` npm package) via `require()`.
 *
 * @private
 * @param  {String} name
 * @return {Object} protocol instance
 * @throws {Error} if the protocol couldn't be `require`'d
 */
const loadProtocol = name => {
  try {
    debug(`Attempting to load the protocol coffea-${name}`)
    // TODO: use defaultImport util here (look at redux-undo-boilerplate)
    protocol = require('coffea-' + name)
  } catch (e) {
    throw new Error(`The protocol coffea-${name} isn't installed. We can't use this protocol.`)
  }
}

/**
 * Create an instance of coffea which loads a protocol, uses it to connect to a
 * service and then provides events.
 *
 * @param  {Object} config
 * @return {Object}
 */
export default function instance (config) {
  if (!config.protocol || !(typeof config.protocol === 'string' || typeof config.protocol === 'function')) {
    throw new Error('Please pass a string or function as the protocol parameter.')
  }

  let methods = {}
  let listeners = {}

  let protocol
  if (typeof config.protocol === 'function') protocol = config.protocol
  else protocol = loadProtocol(config.protocol)

  let handler
  const dispatch = makeDispatch(listeners, () => handler)
  handler = protocol(config, dispatch)

  return {
    on: makeOn(listeners),
    send: handler
  }
}
