# Coffea [![Documentation Status](https://readthedocs.org/projects/coffea/badge/?style=flat&version=latest)](https://readthedocs.org/projects/coffea/?badge=latest) [![Build Status](http://img.shields.io/travis/caffeinery/coffea/master.svg?style=flat)](https://travis-ci.org/caffeinery/coffea) [![Code Climate](http://img.shields.io/codeclimate/github/caffeinery/coffea.svg?style=flat)](https://codeclimate.com/github/caffeinery/coffea) [![NPM version](http://img.shields.io/npm/v/coffea.svg?style=flat)](http://badge.fury.io/js/coffea)
_event based and extensible irc client library with multi-network support_

For support, report an issue on github or join our IRC channel at [##caffeinery @ chat.freenode.net](http://webchat.freenode.net/?channels=%23%23caffeinery&uio=d4)

## API

Documentation is available at [coffea.caffeinery.org](http://coffea.caffeinery.org/en/latest/).

The outdated version of the API is still available [in the wiki](https://github.com/caffeinery/coffea/wiki/API-(outdated)).

## Examples
### Normal Connection (Single network)
```javascript
var client = require('coffea')('chat.freenode.net');
/* full config
var client = require('coffea')({
    host: 'chat.freenode.net',
    port: 6667, // default value: 6667
    nick: 'test', // default value: 'coffea' with random number
    username: 'test', // default value: username = nick
    realname: 'test', // default value: realname = nick
    pass: 'sup3rS3cur3P4ssw0rd' // by default no password will be sent
    nickserv: {
        username: 'test',
        password: 'l33tp455w0rD'
    },
    throttling: 250 // default value: 250ms, 1 message every 250ms, disable by setting to false
});
*/

client.on('motd', function (motd) {
    client.join(['#foo', '#bar', '#baz']);
});

client.on('message', function (event) {
    console.log('[' + event.channel.getName() + '] ' + event.user.getNick() + ': ' + event.message);
    //[#foo] nick: message
    event.reply(event.message); // I'm a parrot
});
```

### Multiple networks
```javascript
var client = require('coffea')(['chat.freenode.net', 'irc.oftc.net']);
/* full config
var client = require('coffea')([
    {
        host: 'chat.freenode.net',
        name: 'freenode', // this is not required but recommended when dealing with multiple networks, by default a numeric id will be assigned
        port: 6667, // default value: 6667
        nick: 'test', // default value: 'coffea' with random number
        username: 'test', // default value: username = nick
        realname: 'test', // default value: realname = nick
        pass: 'sup3rS3cur3P4ssw0rd' // by default no password will be sent
        nickserv: {
            username: 'test',
            password: 'l33tp455w0rD'
        },
        throttling: 250 // default value: 250ms, 1 message every 250ms, disable by setting to false
    },
    {
        host: 'irc.oftc.net',
        name: 'oftc', // this is not required but recommended when dealing with multiple networks, by default a numeric id will be assigned
        port: 6667, // default value: 6667
        nick: 'test', // default value: 'coffea' with random number
        username: 'test', // default value: username = nick
        realname: 'test', // default value: realname = nick
        pass: 'sup3rS3cur3P4ssw0rd' // by default no password will be sent
        nickserv: {
            username: 'test',
            password: 'l33tp455w0rD'
        },
        throttling: 250 // default value: 250ms, 1 message every 250ms, disable by setting to false
    }
]);
*/

// note how we are passing the network here, by default it'll just send to all networks
// by using network you can join specific channels on specific networks
client.on('motd', function (motd, network) {
    client.join(['#foo', '#bar', '#baz'], network);
});

client.on('message', function (event) {
    console.log('[' + event.network + '][' + event.channel.getName() + '] ' + event.user.getNick() + ': ' + event.message);
    //[freenode][#foo] nick: message
    event.reply(event.message); // I'm a parrot
});
```

### Using SSL
```javascript
var client = require('coffea')({
    host: 'chat.freenode.net',
    ssl: true,
    // ssl_allow_invalid: true, // allow invalid/self-signed/expired SSL certs - default value: false
    // port: 6697, // will default to 6697 on ssl
    // nick: 'test', // default value: 'coffea' with random number
    // username: 'test', // default value: username = nick
    // realname: 'test', // default value: realname = nick
    // pass: 'sup3rS3cur3P4ssw0rd' // by default no password will be sent
    // nickserv: {
    //     username: 'test',
    //     password: 'l33tp455w0rD'
    // },
    // throttling: 250 // default value: 250ms, 1 message every 250ms, disable by setting to false
});

client.on('motd', function (motd) {
    client.join(['#foo', '#bar', '#baz']);
});

client.on('message', function (event) {
    console.log('[' + event.channel.getName() + '] ' + event.user.getNick() + ': ' + event.message);
    //[#foo] nick: message
    event.reply(event.message); // I'm a parrot
});
```
