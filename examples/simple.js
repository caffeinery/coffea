import { connect, connection, message } from '../src/index'

// protocol
const slack = (config, dispatch) => {
  setTimeout(() => {
    dispatch(connection({ token: config.token }))
  }, 100)

  setTimeout(() => {
    dispatch(message('test', '#test'))
  }, 250)

  return (e) => {
    console.log('->', e)
    switch (e.type) {
      case 'message':
        console.log('message received:', e.text)
        break
      default:
        dispatch({
          type: 'error',
          text: 'Unknown event'
        })
        break
    }
  }
}
// /protocol

// app
const networks = connect([
  {
    name: 'definedName',
    protocol: slack,
    token: '...'
  },
  {
    protocol: slack,
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
