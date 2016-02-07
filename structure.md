# Connecting

TODO

```js
import connect from 'coffea'

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
```

**Note:** You need to install `coffea-PROTOCOLNAME` to use that protocol, e.g. `npm install coffea-slack`



# Events

Events are a central concept in coffea. They have a certain structure (object with a `type` key):

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

**Note:** In coffea, outgoing and ingoing events are always consistent.


## Listening to events

coffea returns an enhanced array (instance container) after initialization. This means you can use `filter`, like on normal arrays, to only send to certain networks. Or you could use `map` to send a message to all networks. Or you could even combine them!

```js
networks.filter(network => network.protocol === 'slack')

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


## Event helpers

There are helper functions that create events, they can be imported like this:

```js
// `message` is a core event helper (it works on all protocols)
import { message } from 'coffea'

// `attachment` is a protocol specific event helper (it only works on certain protocols)
import { attachment } from 'coffea-slack'
```

Protocols should try to keep similar functionality consistent (e.g. if two protocols support attachments, keep the api consistent so you can use either helper function and it will work for both protocols).

Now you can create an event like this:

```js
message('#dev', 'New commit!')
```

The structure for event helpers is (eventName should always equal the type of the event that is returned to avoid confusion!):

```js
eventName(requiredArgs, { optionalArgs })
```

Multiple protocols can expose the same helper functions, but with enhanced functionality. e.g. for Slack you could do:

```js
import { message, attachment } from 'coffea-slack'
message(channel, text, { attachment: attachment('test.png') })
```


## Sending events

Now that you know how to create events, let's send them.

The array is also enhanced with a `send` function, which allows you to send *calling events* to the networks. e.g. sending a calling `message` event will send a message to the network.

We can use the `message` helper function here:

```js
import { message } from 'coffea'
networks.send(message('#dev', 'Commit!'))
```

### `send` in combination with `on`

If you're sending events as a response to another event, you should use the `send` function that gets passed as an argument to the listener:

```js
import { message } from 'coffea'
const parrot = (msg, send) => send(message(msg.channel, msg.text))
networks.on('message', parrot)
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



# Protocols

TODO



# Example: Reverse bot

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
