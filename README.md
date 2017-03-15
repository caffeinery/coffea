# coffea

[![NPM version](https://img.shields.io/badge/npm-beta-blue.svg?style=flat-square)](https://www.npmjs.com/package/coffea) [![Dependencies](https://img.shields.io/david/caffeinery/coffea/1.0-beta.svg?style=flat-square)](https://david-dm.org/caffeinery/coffea)

_coffea lays the foundations you need to painlessly and effortlessly connect to multiple chat protocols_

**Attention:** `beta15` changed `event.channel` to `event.chat` for more
consistency across protocols. Furthermore, helper functions now accept only
*one* argument with all the options for building the event. Make sure to update
your code when upgrading! You can also use the improved `reply` function now
(which defaults to the current chat if `chat` is not supplied):

```js
reply('hello world!') // reply with a simple message
reply(message('hello world!')) // or you can do this
reply(message({ // reply with a more complex message
  text: 'hello world!',
  protocolSpecificOption: 'something'
}))
```

**Table of contents:**

 * [Connecting](#connecting) (connecting to multiple networks on various protocols)
 * [Events](#events)
   * [Listening on events](#listening-on-events)
   * [Event helpers](#event-helpers) (creating events)
     * [Core events](#core-events) (list of coffea events)
     * [Example: Writing an event helper](#example-writing-an-event-helper)
   * [Sending events](#sending-events)
 * [Example: Reverse bot](#example-reverse-bot) (quickstart example)
 * [Protocols](#protocols) (implementing a new protocol)

## Quickstart

Use the [coffea-starter](https://github.com/coffea-bots/coffea-starter) project to quickly get started developing with coffea!

## Installation

You can install the latest coffea version like this:

```
npm install --save coffea@1.0.0-beta18
```

As for protocols, we're working on [coffea-irc](https://github.com/caffeinery/coffea-irc), [coffea-slack](https://github.com/caffeinery/coffea-slack) and [coffea-telegram](https://github.com/caffeinery/coffea-telegram). Feel free to [build your own](#protocols) if you want to play around with coffea.


## Connecting

The coffea core exposes a `connect` function (along with other functions, which are explained later). It can be imported like this:

```js
import { connect } from 'coffea'
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
    network: 'irc.6697.eu',
    channels: ['#foo', '#bar']
  }
])

// the instance container exposes the `on` and `send` functions:
networks.send({...}) // we'll learn about sending events later
networks.on('message', (msg, reply) => {...}) // we'll learn about listening to events later
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
  chat: '#dev',
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
networks.on('event', (event, reply) => { ... })

networks
  .filter(network => network.protocol === 'slack')
  .on('message', msg => console.log(msg.text))

// sending events will be explained more later
const parrot = (msg, reply) => reply(msg.text)
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
message(name, chat, options)
message('New commit!', '#dev', { protocolSpecificOption: 'something' })
```

Or you can use an object instead:

```js
message({
  text: 'New commit!',
  chat: '#dev',
  protocolSpecificOption: 'something'
})
```

The structure for event helpers is:

```js
eventName(argument1, argument2, ..., options) // for global events
eventName(argument1, argument2, ..., chat, options) // for events that are specific to a certain chat
```

Make sure your event helper is also usable with an object:

```js
eventName({ argument1, argument2, ..., option1, option2, ...})
eventName({ argument1, argument2, ..., chat, option1, option2, ...})
```

(`eventName` should always equal the `type` of the event that is returned to avoid confusion!)

Multiple protocols can expose the same helper functions, but with enhanced functionality. e.g. for Slack you could do:

```js
import { message, attachment } from 'coffea-slack'
message({ chat, text, attachment: attachment('test.png') })
```

**Note:** coffea core's `message` helper function (if you import with `import { message } from 'coffea'`) does not implement the `attachment` option!

#### Core events

coffea defines certain event helpers that should be used when developing protocols
in order to ensure consistency. You can import and use all helpers like this:

```js
import { event, connection, message, privatemessage, command, error } from 'coffea'
event(name, data) // `name` required; e.g. event('ping')
connection()
message(text, chat, options) // `text` required; e.g. message('hi!')
privatemessage(text, chat, options) // `text` required; e.g. privatemessage('hi!')
command(cmd, args, chat, options) // `cmd` required; e.g. `command('ping')`
error(err, options) // `err` required; e.g. `error(new Error('fail'))`
```

You can alternatively pass an object as the first parameter instead, e.g.:

```js
message({
  text: 'hello world',
  someOption: true // instead of using `options` as a separate argument, you can just pass them directly in the object
})
```

#### Example: Writing an event helper

```js
import { isObject } from 'coffea'

/**
 * Make sure to add some information about the event helper here.
 *
 * @param  {type} arg
 * @param  {type} [optionalArg]
 * @return {Object} example event
 */
export const example = (arg, optionalArg, options) => {
  // make the helper work with an object
  if (isObject(arg)) {
    // we need to rename `arg` to `_arg` here to avoid overshadowing the variable
    let { arg: _arg, optionalArg, ...options } = arg
    return example(_arg, optionalArg, options)
  }

  // do some sanity checks
  if (!arg) {
    throw new Error(
      'An `example` event needs at least a `arg` parameter, ' +
      'e.g. example(\'arg\') or example({ arg: \'arg\' })'
    )
  }

  // create the event
  // make sure to put ...options first or it will overwrite other properties!
  return {
    ...options,
    type: 'example',
    arg, optionalArg
  }
}
```


### Sending events

Now that you know how to create events, let's send them to the networks.

The instance container is also enhanced with a `send` function, which allows you to send *calling events* to the networks. e.g. sending a calling `message` event will send a message to the network.

**Note:** As mentioned before, in coffea *calling events* and *receiving events* always look the same.

You can use the `message` helper function to send an event to all networks:

```js
import { message } from 'coffea'

// send to all networks:
networks.send(message({ chat: '#dev', text: 'Commit!' }))

// send to slack networks only:
networks
  .filter(network => network.protocol === 'slack')
  .send(message({ chat: '#random', text: 'Secret slack-only stuff.' }))
```

#### `send` in combination with `on`

If you're sending events as a response to another event, you should use the `reply` function that gets passed as an argument to the listener. It will automatically figure out where to send the message instead of sending it to all networks (like `networks.send` does):

```js
networks.on('message', (msg, reply) => reply(msg.text))
```

You may want to keep the function definitions (`const parrot = ...`) separate from the `on` statement (`networks.on(...)`). This allows for easy unit tests:

```js
// somefile.js
export const parrot = (msg, reply) => reply(msg.text)
export const reverse = (msg, reply) => {
  const reversedText = msg.text.split('').reverse().join('')
  reply(reversedText)
}

// unittests.js
import { assert } from 'my-favorite-testing-library'
import { parrot, reverse } from './somefile'
parrot('hello world', (msg) => assert(msg.text === 'hello world'))
reverse('hello world', (msg) => assert(msg.text === 'dlrow olleh'))

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
import { connect, message } from 'coffea'

const networks = connect([
  {
    protocol: 'irc',
    network: 'irc.6697.eu',
    channels: ['#coffea', '#test']
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

const reverse = (msg, reply) => {
  const reversedText = msg.text.split('').reverse().join('')
  reply(reversedText)
}

networks.on('connection', (evt) => console.log('connected to ' + evt.network))

networks.on('message', reverse)
```



## Protocols

This is a guide on how to implement a new protocol with coffea.

Protocols are functions that take `config` (a network configuration), and a `dispatch` function as arguments. They return a function that will handle all *calling events* sent to the protocol later.

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
import { connect, message } from 'coffea'
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
    err: new Error('Unknown event')
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

You can (and should!) use the same coffea helpers for protocols:

```js
import { forward, message, error } from 'coffea'

const messageHandler = dispatch => event =>
  dispatch(message({ text: event.text })

const defaultHandler = dispatch => event =>
  dispatch(error({ err: new Error('Unknown event') })

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
