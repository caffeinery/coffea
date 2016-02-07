export const message = (channel, text, ...options) => {
  if (channel === undefined || text === undefined) {
    throw new Error('Not enough parameters to construct a proper event')
  }

  return {
    type: 'message',
    ...options, channel, text
  }
}
