# coffea

[![NPM version (>=0.4)](https://img.shields.io/npm/v/coffea.svg?style=flat-square)](https://www.npmjs.com/package/coffea) [![Build Status](https://img.shields.io/travis/caffeinery/coffea/master.svg?style=flat-square)](https://travis-ci.org/caffeinery/coffea) [![Dependencies](https://img.shields.io/david/caffeinery/coffea.svg?style=flat-square)](https://david-dm.org/caffeinery/coffea) [![Documentation Status](https://readthedocs.org/projects/coffea/badge/?style=flat-square&version=latest)](https://readthedocs.org/projects/coffea/?badge=latest) [![Code Climate](https://img.shields.io/codeclimate/github/caffeinery/coffea.svg?style=flat-square)](https://codeclimate.com/github/caffeinery/coffea) [![Coverage](https://img.shields.io/coveralls/caffeinery/coffea.svg?style=flat-square)](https://coveralls.io/r/caffeinery/coffea)

_coffea lays the foundations you need to painlessly and effortlessly connect to multiple chat protocols_

**Table of contents:**

 * [Connecting](#connecting) (connecting to multiple networks on various protocols)
 * [Events](#events)
   * [Listening on events](#listening-on-events)
   * [Event helpers](#event-helpers) (creating events)
   * [Sending events](#sending-events)
 * [Example: Reverse bot](#example-reverse-bot) (quickstart example)
 * [Protocols](#protocols) (implementing a new protocol)


## Try it out!

You can install the latest coffea version like this:

```
npm install --save coffea@beta
```

As for protocols, we're working on [coffea-irc](https://github.com/caffeinery/coffea-irc), [coffea-slack](https://github.com/caffeinery/coffea-slack) and [coffea-telegram](https://github.com/caffeinery/coffea-telegram). Feel free to [build your own](#protocols) if you want to play around with coffea.


## Connecting

The coffea core exposes a `connect` function as the default export. It can be imported like this:

```js
import connect from 'coffea'
```

This function loads the required protocols (via `node_modules`) and returns an instance container, which has the `on` and `send` functions.

```js
// create an instance container for one irc instance
// Note: options get passed to the protocol, which handles them (e.g. autojoin channels on irc)
//       please refer to the protocol documentation for more information about these options
//       (usually available at https://npmjs.com/package/coffea-PROTOCOLNAME)
const networks = connect([
  {
    protocol: 'irc',
    network: '...',
    channels: ['#foo', '#bar']
  }
])

// the instance container exposes the `on` and `send` functions:
networks.send({...}) // we'll learn about sending events later
networks.on('message', (msg, send) => {...}) // we'll learn about listening to events later
```

**Note:** You need to install `coffea-PROTOCOLNAME` to use that protocol, e.g. `npm install coffea-slack`

You can now use this function to connect to networks and create instance containers! :tada:



## Events

Events are *the* central concept in coffea. They have a certain structure (object with a `type` key):

```js
{
  type: 'EVENT_NAME',
  ...
}
```

For a message, it could look like this (imagine a git bot):

```js
{
  type: 'message',
  channel: '#dev',
  text: 'New commit!'
}
```

**Note:** In coffea, outgoing and ingoing events are always consistent - they look the same. That way you don't need to memorize two separate structures for sending/receiving events - awesome! (might even save some code)


### Listening on events

coffea's `connect` function transforms the passed configuration array into an instance container, which is an enhanced array. This means you can use normal array functions, like `map` and `filter`. e.g. you could filter networks and only listen to `slack` networks, or you could use `map` to send a message to all networks. You could even combine them!

```js
// only listen to `slack` networks:
networks.filter(network => network.protocol === 'slack')

// `map` and `filter` combined
networks
  .filter(network => network.protocol === 'slack')
  .map(network => console.log(network))
```

The array is enhanced with an `on` function (and a `send` function, more on that later), which allows you to listen to events on the instance container:

```js
networks.on('event', (event, send) => { ... })

networks
  .filter(network => network.protocol === 'slack')
  .on('message', msg => console.log(msg.text))

// sending events will be explained more later
const parrot = (msg, send) => send(message(msg.channel, msg.text))
networks.on('message', parrot)
```


### Event helpers

You probably don't want to deal with raw event objects all the time - you write a lot of boilerplate and it's prone to error. That's why coffea (and the protocols) provide helper functions that create events, they can be imported like this:

```js
// `message` is a core event helper (it works on all protocols)
import { message } from 'coffea'

// `attachment` is a protocol specific event helper (it only works on certain protocols)
import { attachment } from 'coffea-slack'
```

**Note:** Protocols should try to keep similar functionality consistent (e.g. if two protocols support attachments, keep the api consistent so you can use either helper function and it will work for both protocols).

Now you can create an event like this:

```js
message('#dev', 'New commit!')
```

The structure for event helpers is:

```js
eventName(requiredArgs, { optionalArgs })
```

(`eventName` should always equal the `type` of the event that is returned to avoid confusion!)

Multiple protocols can expose the same helper functions, but with enhanced functionality. e.g. for Slack you could do:

```js
import { message, attachment } from 'coffea-slack'
message(channel, text, { attachment: attachment('test.png') })
```

**Note:** coffea core's `message` helper function (if you import with `import { message } from 'coffea'`) does not implement the `attachment` option!


### Sending events

Now that you know how to create events, let's send them to the networks.

The instance container is also enhanced with a `send` function, which allows you to send *calling events* to the networks. e.g. sending a calling `message` event will send a message to the network.

**Note:** As mentioned before, in coffea *calling events* and *receiving events* always look the same.

You can use the `message` helper function to send an event to all networks:

```js
import { message } from 'coffea'

// send to all networks:
networks.send(message('#dev', 'Commit!'))

// send to slack networks only:
networks
  .filter(network => network.protocol === 'slack')
  .send(message('#random', 'Secret slack-only stuff.'))
```

#### `send` in combination with `on`

If you're sending events as a response to another event, you should use the `send` function that gets passed as an argument to the listener:

```js
import { message } from 'coffea'
networks.on('message', (msg, send) => send(message(msg.channel, msg.text)))
```

You may want to keep the function definitions (`const parrot = ...`) separate from the `on` statement (`networks.on(...)`). This allows for easy unit tests:

```js
// somefile.js
import { message } from 'coffea'
export const parrot = (msg, send) => send(message(msg.channel, msg.text))
export const reverse = (msg, send) => {
  const reversedText = msg.text.split('').reverse().join('')
  const message = message(msg.channel, reversedText)

  send(message)
}

// unittests.js
import { assert } from 'my-favorite-testing-library'
import { parrot, reverse } from './somefile'
parrot('test', msg => assert(msg.text === 'test'))
reverse('test', msg => assert(msg.text === 'tset'))

// main.js
import connect from 'coffea'
import { parrot, reverse } from './somefile'
const networks = connect([...]) // put network config here
networks.on('message', reverse)
// or...
networks.on('message', parrot)
```



## Example: Reverse bot

```js
import connect, { message } from 'coffea'

const networks = connect([
  {
    protocol: 'irc',
    network: '...',
    channels: ['#foo', '#bar']
  },
  {
    protocol: 'telegram',
    token: '...'
  },
  {
    protocol: 'slack',
    token: '...'
  }
])

const reverse = (msg, send) => {
  const reversedText = msg.text.split('').reverse().join('')
  const message = message(msg.channel, reversedText)

  send(message)
}

networks.on('message', reverse)
```



## Protocols

This is a guide on how to implement a new protocol with coffea.

Protocols are functions that take `config`, a network configuration, and a `dispatch` function as arguments. They return a function that will handle all *calling events* sent to the protocol later.

A simple protocol could look like this:

```js
export default const dummyProtocol = (config, dispatch) => {
  // mock connect event
  dispatch({
    type: 'connect',
    network: config.network
  })

  return event => {
    switch (event.type) {
      case 'message':
        dispatch({
          type: 'message',
          text: event.text
        })
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
```

To use this protocol, you have to pass the protocol function to `connect`:

```js
import connect, { message } from 'coffea'
import dummyProtocol from './dummy'

const networks = connect([
  {
    protocol: dummyProtocol,
    network: 'test'
  }
])

const logListener = msg => console.log(msg)
networks.on('message', logListener)

networks.send(message('hello world!'))
```

`dummyProtocol`'s event handler will then receive the following as the `event` argument:

```js
{
  type: 'message',
  text: 'hello world!'
}
```

Which means it will dispatch the `message` event, which results in the `on('message', listener)` listeners getting called with the same `event` argument.

Finally, the `logListener` function will get called, which results in the following output on the console:

```
{
  type: 'message',
  text: 'hello world!'
}
```

### `forward` helper

```js
forward({
  eventName: function,
  ...
})
```

You probably don't want to use `switch` statements to parse the events, which is why coffea provides a `forward` helper function. It forwards the events (depending on their type) to the specific handler function and can be used like this:

```js
import { forward } from 'coffea'

export default const dummyProtocol = (config, dispatch) => {
  // mock connect event
  dispatch({
    type: 'connect',
    network: config.network
  })

  return forward({
    'message': event => dispatch({
        type: 'message',
        text: event.text
      }),

    'default': event => dispatch({
        type: 'error',
        text: 'Unknown event'
      })
  })
}
```

**Note:** `'default'` will be called if the event doesn't match any of the other defined types.

This helper also allows you to separate your event handlers from the protocol logic:

```js
import { forward } from 'coffea'

const messageHandler = dispatch => event =>
  dispatch({
    type: 'message',
    text: event.text
  })

const defaultHandler = dispatch => event =>
  dispatch({
    type: 'error',
    text: 'Unknown event'
  })

export default const dummyProtocol = (config, dispatch) => {
  // mock connect event
  dispatch({
    type: 'connect',
    network: config.network
  })

  return forward({
    'message': messageHandler(dispatch),
    'default': defaultHandler(dispatch)
  })
}
```
