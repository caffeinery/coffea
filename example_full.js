import connect, { message, forward } from './src/index'

// protocol
const messageHandler = dispatch =>
  e => console.log('message received:', e.text)

const defaultHandler = dispatch =>
  e => dispatch({
    type: 'error',
    text: 'Unknown event'
  })

const connectTo = (token, dispatch) =>
  setTimeout(() => {
    dispatch({
      type: 'connect',
      token: token
    })
  }, 100)

const registerEvents = dispatch =>
  setInterval(() => {
    dispatch({
      type: 'message',
      channel: '#test',
      text: Math.random().toString(36).substring(7)
    })
  }, 250)

const exampleProtocol = (config, dispatch) => {
  connectTo(config.token, dispatch)
  registerEvents(dispatch)
  return forward({
    'message': messageHandler,
    'default': defaultHandler
  })
}
// /protocol

// app
const networks = connect([
  {
     protocol: exampleProtocol,
     token: '...'
  }
])

networks.on('event', e => console.log(e))

const reverse = (msg, send) => {
  const reversedText = msg.text.split('').reverse().join('')
  const reversedMessage = message(msg.channel, reversedText)

  send(reversedMessage)
}

networks.on('message', reverse)
// /app
