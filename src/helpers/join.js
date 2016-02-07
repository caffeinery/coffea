export default function join (channel, ...options) {
  if (channel === undefined) {
    throw new Error('Not enough parameters to construct a proper event')
  }

  return {
    type: 'join',
    ...options, channel
  }
}
