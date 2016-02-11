/**
 * Create a `message` event that will be sent to the given `channel` containing
 * the given `text`. Additional `options` can be added that will be parsed by
 * the protocol.
 *
 * @param  {String} channel
 * @param  {String} text
 * @param  {Object} [options]
 * @return {Object} message event
 */
export const message = (channel, text, ...options) => {
  if (channel === undefined || text === undefined) {
    throw new Error('Not enough parameters to construct a proper event')
  }

  return {
    type: 'message',
    ...options, channel, text
  }
}

/**
 * Create a `command` event that will be sent to the given `channel` containing
 * the given command `cmd` and arguments `args`. Additional `options` can be
 * added that will be parsed by the protocol.
 *
 * @param  {String} channel
 * @param  {String} cmd
 * @param  {Array}  args
 * @param  {Object} [options]
 * @return {Object} message event
 */
export const command = (channel, cmd, args, ...options) => {
  if (channel === undefined || cmd === undefined || args === undefined) {
    throw new Error('Not enough parameters to construct a proper event')
  }

  // TODO: more sanity checks here and in other event helpers

  if (!Array.isArray(args)) {
    throw new Error('`args` parameter is not an array')
  }

  return {
    type: 'message',
    ...options, channel, text
  }
}

/**
 * Create an `error` event given a normal Error object `err`.
 *
 * @param  {Error} err
 * @param  {Object} [options]
 * @return {Object} error event
 */
export const error = (err, ...options) => {
  if (!err instanceof Error) {
    throw new Error('Parameter is not an Error object (`instanceof Error`)')
  }

  return {
    type: 'error',
    ...options, err
  }
}
