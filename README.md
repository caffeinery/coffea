# coffea

[![NPM version (>=0.4)](https://img.shields.io/npm/v/coffea.svg?style=flat-square)](https://www.npmjs.com/package/coffea) [![Build Status](https://img.shields.io/travis/caffeinery/coffea/master.svg?style=flat-square)](https://travis-ci.org/caffeinery/coffea) [![Dependencies](https://img.shields.io/david/caffeinery/coffea.svg?style=flat-square)](https://david-dm.org/caffeinery/coffea) [![Documentation Status](https://readthedocs.org/projects/coffea/badge/?style=flat-square&version=latest)](https://readthedocs.org/projects/coffea/?badge=latest) [![Code Climate](https://img.shields.io/codeclimate/github/caffeinery/coffea.svg?style=flat-square)](https://codeclimate.com/github/caffeinery/coffea) [![Coverage](https://img.shields.io/coveralls/caffeinery/coffea.svg?style=flat-square)](https://coveralls.io/r/caffeinery/coffea)

_coffea lays the foundations you need to painlessly and effortlessly connect to multiple chat protocols_


## WIP / Unstable

This is a work in progress. It may be unstable and the branch build might be failing (this branch: [![Build Status](https://img.shields.io/travis/caffeinery/coffea/0.6.svg?style=flat-square)](https://travis-ci.org/caffeinery/coffea)). We plan to update the README with docs as we progress through this re-write so if you're curious to try somthing super crazy unstable, you can, provided you're aware we're not responsible if this WIP version of coffea kills your cat.


## Connecting

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



## Events

Events are the central concept in coffea. They have a certain structure (object with a `type` key):

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


### Listening to events

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


### Event helpers

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


### Sending events

Now that you know how to create events, let's send them.

The array is also enhanced with a `send` function, which allows you to send *calling events* to the networks. e.g. sending a calling `message` event will send a message to the network.

We can use the `message` helper function here:

```js
import { message } from 'coffea'
networks.send(message('#dev', 'Commit!'))
```

#### `send` in combination with `on`

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



## Protocols

TODO



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
