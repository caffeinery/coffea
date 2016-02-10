import connect, { message } from './src/index'

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
      channel: '#test',
      text: 'test'
    })
  }, 250)

  return event => {
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

const networks = connect(
  {
     protocol: slack,
     token: '...'
  }
)

networks.on('event', e => console.log(e))

const reverse = (msg, send) => {
  const reversedText = msg.text.split('').reverse().join('')
  const reversedMessage = message(msg.channel, reversedText)

  send(reversedMessage)
}

networks.on('message', reverse)

