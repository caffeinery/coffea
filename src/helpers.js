import { isObject } from './utils'

/**
 * Create an event with a `name` and optional `options`.
 *
 * @param  {String} name
 * @param  {Object} [options]
 * @return {Object} event
 */
export const event = (name, options) => {
  if (isObject(name)) {
    let { name: _name, ...options } = name
    return event(_name, options)
  }

  if (!name) {
    throw new Error(
      'An event needs at least a `name` parameter, ' +
      'e.g. event(\'test\') or event({ name: \'test\' })'
    )
  }

  return {
    ...options,
    type: name
  }
}

/**
 * Create a `connection` event.
 *
 * @return {Object} connection event
 */
export const connection = (options) => event('connection', options)

/**
 * Create a `message` event containing the given `text`. If specified, it will
 * be sent to the given `chat`. Additional `options` can be added that will be
 * parsed by the protocol.
 *
 * @param  {String} text
 * @param  {String} [chat]
 * @param  {Object} [options]
 * @return {Object} message event
 */
export const message = (text, chat, options) => {
  if (isObject(text)) {
    let { text: _text, chat, ...options } = text
    return message(_text, chat, options)
  }

  if (!text) {
    throw new Error(
      'A `message` event needs at least a `text` parameter, ' +
      'e.g. message(\'hello world!\') or message({ text: \'hello world!\'})'
    )
  }

  return {
    ...options,
    type: 'message',
    chat, text
  }
}

/**
 * Create a `message` event with the `private` option set to `true`.
 * This is equivalent to specifying `{ private: true }` as `options` to the
 * regular `message` helper function
 *
 * @param  {String} text
 * @param  {String} [chat]
 * @param  {Object} [options]
 * @return {Object} message event
 */
export const privatemessage = (text, chat, options) => {
  return {
    ...message(text, chat, options),
    private: true
  }
}

/**
 * Create a `command` event that will be sent to the given `chat` containing
 * the given command `cmd` and arguments `args`. Additional `options` can be
 * added that will be parsed by the protocol.
 *
 * @param  {String} cmd
 * @param  {Array}  [args]
 * @param  {String} [chat]
 * @param  {Object} [options]
 * @return {Object} message event
 */
export const command = (cmd, args, chat, options) => {
  if (isObject(cmd)) {
    let { cmd: _cmd, args = [], chat, ...options } = cmd
    return command(_cmd, args, chat, options)
  }

  if (cmd === undefined) {
    throw new Error(
      'A `command` event needs at least a `cmd` parameter, ' +
      'e.g. command(\'send\', [\'hello\', \'world\']) or ' +
      'command({ cmd: \'send\', args: [\'hello\', \'world\'] })'
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
export const error = (err, options) => {
  if (isObject(err) && err.hasOwnProperty('err')) {
    let { err: _err, ...options } = err
    return error(_err, options)
  }

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
