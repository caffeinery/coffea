# Coffea [![Build Status](https://travis-ci.org/thecoffeehouse/coffea.svg?branch=master)](https://travis-ci.org/thecoffeehouse/coffea)
_event based and extensible irc client library with multi-network support_

## API
The outdated (but currently more complete) version of the API is available [in the wiki](https://github.com/thecoffeehouse/coffea/wiki/API-(outdated)).

We are working on an up-to-date version [on another page in the wiki](https://github.com/thecoffeehouse/coffea/wiki/API).

## Examples
### Normal Connection (Single network)
```javascript
var client = require('coffea')({
    host: 'irc.freenode.org',
    // port: 6667, // default value: 6667
    // nick: 'test', // default value: 'coffea' with random number
    // username: 'test', // default value: username = nick
    // realname: 'test', // default value: realname = nick
    // pass: 'sup3rS3cur3P4ssw0rd' // by default no password will be sent
    // nickserv: {
    //     username: 'test',
    //     password: 'l33tp455w0rD'
    // }
});

client.on('motd', function (motd) {
    client.join(['#foo', '#bar', '#baz']);
});

client.on('message', function (event) {
    console.log('[' + event.channel.getName() + '] ' + event.user.getNick() + ': ' + event.message);
    //[#foo] nick: message
});
```

### Multiple networks
```javascript
var client = require('coffea')([
    {
        host: 'irc.freenode.org',
        name: 'freenode', // this is not required but recommended when dealing with multiple networks, by default a numeric id will be assigned
        // port: 6667, // default value: 6667
        // nick: 'test', // default value: 'coffea' with random number
        // username: 'test', // default value: username = nick
        // realname: 'test', // default value: realname = nick
        // pass: 'sup3rS3cur3P4ssw0rd' // by default no password will be sent
        // nickserv: {
        //     username: 'test',
        //     password: 'l33tp455w0rD'
        // }
    },
    {
        host: 'irc.oftc.net',
        name: 'oftc', // this is not required but recommended when dealing with multiple networks, by default a numeric id will be assigned
        // port: 6667, // default value: 6667
        // nick: 'test', // default value: 'coffea' with random number
        // username: 'test', // default value: username = nick
        // realname: 'test', // default value: realname = nick
        // pass: 'sup3rS3cur3P4ssw0rd' // by default no password will be sent
        // nickserv: {
        //     username: 'test',
        //     password: 'l33tp455w0rD'
        // }
    }
]);

// note how we are passing the network here, by default it'll just send to all networks
// by using network you can join specific channels on specific networks
client.on('motd', function (motd, network) {
    client.join(['#foo', '#bar', '#baz'], network);
});

client.on('message', function (event) {
    console.log('[' + event.network + '][' + event.channel.getName() + '] ' + event.user.getNick() + ': ' + event.message);
    //[freenode][#foo] nick: message
});
```

### Using SSL
```javascript
var client = require('coffea')({
    host: 'irc.freenode.org',
    ssl: true,
    port: 6697,
    // nick: 'test', // default value: 'coffea' with random number
    // username: 'test', // default value: username = nick
    // realname: 'test', // default value: realname = nick
    // pass: 'sup3rS3cur3P4ssw0rd' // by default no password will be sent
    // nickserv: {
    //     username: 'test',
    //     password: 'l33tp455w0rD'
    // }
});

client.on('motd', function (motd) {
    client.join(['#foo', '#bar', '#baz']);
});

client.on('message', function (event) {
    console.log('[' + event.channel.getName() + '] ' + event.user.getNick() + ': ' + event.message);
    //[#foo] nick: message
});
```
