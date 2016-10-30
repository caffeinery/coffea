import { connect, error, connection, message, forward } from '../src/index'

// protocol
const messageHandler = (dispatch) =>
  (e) => console.log('message received:', e.text)

const defaultHandler = (dispatch) =>
  (e) => dispatch(error(new Error('unknown event')))

const connectTo = (token, dispatch) =>
  setTimeout(() => {
    dispatch(connection({ token }))
  }, 100)

const registerEvents = (dispatch) =>
  setInterval(() => {
    dispatch(message({
      text: Math.random().toString(36).substring(7),
      chat: '#test'
    }))
  }, 250)

const exampleProtocol = (config, dispatch) => {
  connectTo(config.token, dispatch)
  registerEvents(dispatch)
  return forward({
    'message': messageHandler(dispatch),
    'default': defaultHandler(dispatch)
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

networks.on('event', (e) =>
  console.log('<-', e)
)

networks.on('connection', (e) =>
  console.log('connected to', e.network, 'with token:', e.token)
)

const reverse = (msg, reply) =>
  reply(msg.text.split('').reverse().join(''))

networks.on('message', reverse)
// /app
