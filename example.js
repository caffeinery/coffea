import { connect, message } from './src/index'

const slack = (config, dispatch) => {
  setTimeout(() => {
    dispatch({
      type: 'connect',
      token: config.token
    })
  }, 100)

  setTimeout(() => {
    dispatch({
      type: 'message',
      chat: '#test',
      text: 'test'
    })
  }, 250)

  return (event) => {
    switch (event.type) {
      case 'message':
        console.log('message received:', event.text)
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

networks.on('event', (e) => console.log(e))

const reverse = (msg, reply) => {
  const reversedText = msg.text.split('').reverse().join('')
  const reversedMessage = message(msg.chat, reversedText)

  reply(reversedMessage)
}

networks.on('message', reverse)
