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
