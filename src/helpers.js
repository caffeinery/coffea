/**
 * Create a `message` event that will be sent to the given `chat` containing
 * the given `text`. Additional `options` can be added that will be parsed by
 * the protocol.
 *
 * @param  {String} chat
 * @param  {String} text
 * @param  {Object} [options]
 * @return {Object} message event
 */
export const message = ({ chat, text, ...options }) => {
  if (text === undefined) {
    throw new Error(
      'A `message` event needs at least a `text` parameter, ' +
      'e.g. message({ text: \'hello world!\'})'
    )
  }

  return {
    ...options,
    type: 'message',
    chat, text
  }
}

/**
 * Create a `command` event that will be sent to the given `chat` containing
 * the given command `cmd` and arguments `args`. Additional `options` can be
 * added that will be parsed by the protocol.
 *
 * @param  {String} chat
 * @param  {String} cmd
 * @param  {Array}  args
 * @param  {Object} [options]
 * @return {Object} message event
 */
export const command = ({ chat, cmd, args = [], ...options }) => {
  if (cmd === undefined) {
    throw new Error(
      'A `command` event needs at least a `cmd` parameter, ' +
      'e.g. command({ cmd: \'send\', args: [\'hello\', \'world\'] })'
    )
  }

  if (!Array.isArray(args)) {
    throw new Error('Invalid `command` event: `args` parameter is not an array')
  }

  return {
    ...options,
    type: 'command',
    chat, cmd, args
  }
}

/**
 * Create an `error` event given a normal Error object `err`.
 *
 * @param  {Error} err
 * @param  {Object} [options]
 * @return {Object} error event
 */
export const error = ({ err, ...options }) => {
  if (!err instanceof Error) {
    throw new Error(
      'An `error` event needs at least a `err` parameter, ' +
      'which has to be an Error object, ' +
      'e.g. error({ err: new Error(\'error message\') })'
    )
  }

  return {
    ...options,
    type: 'error',
    err
  }
}
