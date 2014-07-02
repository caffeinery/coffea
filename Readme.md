## Table of Contents
- [Example](#example)
    - [`Normal Connection`](#normal-connection)
    - [`Using SSL`](#using-ssl)
- [API](#api)
    - [`Client`](#clientstream)
        - [`write(str, fn)`](#writestr-fn)
        - [`getUser(nick)`](#getusernick)
        - [`getChannel(name)`](#getchannelname)
        - [`pass(pass, fn)`](#passpass-fn)
        - [`nick(nick, fn)`](#nicknick-fn)
        - [`user(username, realname, fn)`](#userusername-realname-fn)
        - [`invite(name, channel, fn)`](#invitename-channel-fn)
        - [`send(target, msg, fn)`](#sendtarget-msg-fn)
        - [`notice(target, msg, fn)`](#noticetarget-msg-fn)
        - [`join(channels, fn)`](#joinchannels-fn)
        - [`part(channels, msg, fn)`](#partchannels-msg-fn)
        - [`topic(channel, topic, fn)`](#topicchannel-topic-fn)
        - [`kick(channels, nicks, msg, fn)`](#kickchannels-nicks-msg-fn)
        - [`quit(msg, fn)`](#quitmsg-fn)
        - [`oper(name, password, fn)`](#opername-password-fn)
        - [`mode(target, flags, params, fn)`](#modetarget-flags-params-fn)
        - [`names(channel, fn)`](#nameschannel-fn)
        - [`getServerInfo()`](#getserverinfo)
        - [`whois(target, fn)`](#whoistarget-fn)
        - [`use(fn)`](#usefn)
        - [`Events`](#events)
            - [`away`](#away-event)
            - [`data`](#data-parsed)
            - [`invite`](#invite-event)
            - [`join`](#join-event)
            - [`kick`](#kick-event)
            - [`mode`](#mode-event)
            - [`motd`](#motd-motd)
            - [`names`](#names-event)
            - [`nick`](#nick-event)
            - [`notice`](#notice-event)
            - [`part`](#part-event)
            - [`ping`](#ping)
            - [`message`](#message-event)
            - [`privatemessage`](#privatemessage-event)
            - [`quit`](#quit-event)
            - [`topic`](#topic-event)
            - [`welcome`](#welcome-event)
            - [`whois`](#whois-err-data)
    - [`User`](#usernick-client)
        - [`toString()`](#tostring)
        - [`getNick()`](#getnick)
        - [`getUsername()`](#getusername)
        - [`getRealname()`](#getrealname)
        - [`getHostname()`](#gethostname)
        - [`getChannels()`](#getchannels)
        - [`getServer()`](#getserver)
        - [`getServerInfo()`](#getserverinfo)
        - [`getAway()`](#getaway)
        - [`getAccount()`](#getaccount)
        - [`isRegistered()`](#isregistered)
        - [`isUsingSecureConnection()`](#isusingsecureconnection)
        - [`getIdle()`](#getidle)
        - [`getSignonTime()`](#getsignontime)
        - [`isOper()`](#isoper)
        - [`notice(msg)`](#noticemsg)
        - [`say(msg)`](#saymsg)
        - [`whois(fn)`](#whoisfn)
    - [`Channel`](#channelname-client)
        - [`toString()`](#tostring-1)
        - [`getName()`](#getname)
        - [`getTopic()`](#gettopic)
        - [`getNames()`](#getnames)
        - [`userHasMode(user, mode)`](#userhasmodeuser-mode)
        - [`isUserInChannel(user)`](#isuserinchanneluser)
        - [`notice(msg)`](#noticemsg-1)
        - [`say(msg)`](#saymsg-1)
        - [`reply(user, msg)`](#replyuser-msg)
        - [`kick(user, reason)`](#kickuser-reason)
        - [`ban(mask)`](#banmask)
        - [`unban(mask)`](#unbanmask)

# Example
### Normal Connection
```javascript
var coffea = require('coffea'),
    net = require('net');

var stream = net.connect({
    port: 6667,
    host: 'irc.freenode.org'
});
var client = coffea(stream);

client.pass('sup3rS3cur3P4ssw0rd');
client.nick('GLaDOS');
client.user('GLaDOS', 'Genetic Lifeform and Disk Operating System');

client.on('motd', function (motd) {
    client.join(['#foo', '#bar', '#baz']);
});

client.on('message', function (event) {
    console.log('[' event.channel.getName() '] ' + event.user.getNick() + ': ' + event.message);
    //[#foo] nick: message
});
```
### Using SSL
```javascript
var coffea = require('coffea'),
    tls = require('tls');

var stream = tls.connect(6697, 'irc.freenode.org', {
    rejectUnauthorized: false
}, function () {
    if (stream.authorized || stream.authorizationError === 'DEPTH_ZERO_SELF_SIGNED_CERT' || stream.authorizationError === 'CERT_HAS_EXPIRED' || stream.authorizationError === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
        if (stream.authorizationError === 'CERT_HAS_EXPIRED') {
            console.log('Connecting to server with expired certificate');
        }
    } else {
        console.error('[SSL-Error]' + stream.authorizationError);
    }
});
var client = coffea(stream);

client.pass('sup3rS3cur3P4ssw0rd');
client.nick('GLaDOS');
client.user('GLaDOS', 'Genetic Lifeform and Disk Operating System');

client.on('motd', function (motd) {
    client.join(['#foo', '#bar', '#baz']);
});

client.on('message', function (event) {
    console.log('[' event.channel.getName() '] ' + event.user.getNick() + ': ' + event.message);
    //[#foo] nick: message
});
```

# API

### `Client(stream)`
Initialize a new IRC client with the given duplex `stream`.

___
#### `write(str, fn)`
Writes the raw line `str` to the stream and calls `fn()` when this chunk of data is flushed.

```javascript
client.write('PRIVMSG #channel: Why hello there');
```

___
#### `getUser(nick)`
Get the [`[User  object]`](#usernick) representing the user by the given `nick`. If no n `nick` is given, the function will return the [`[User  object]`](#usernick) representing the client.

```javascript
client.getUser('foo');
```

___
#### `getChannel(name)`
Get the [`[Channel object]`](#channelname) representing the channel by the given `name`.

```javascript
client.getChannel('#foo');
```

___
#### `pass(pass, fn)`
Sends the password `pass` to the server.

```javascript
client.pass('topsecret');
```

___
#### `nick(nick, fn)`
Specify an irc `nick` for the user.

```javascript
client.nick('maggin');
```

___
#### `user(username, realname, fn)`
Used at the beginning of connection to specify the username and realname of a new user.

```javascript
client.user('maggin', 'maddin');
```

___
#### `invite(name, channel, fn)`
Send an invite to `name`, for a `channel`. `name` can either be a string or a [`[User object]`](#usernick).

```javascript
client.invite('maggin', '#dev');
```

___
#### `send(target, msg, fn)` 
Send a `msg` to the `target`. 
`target` can either be a string, a [`[User object]`](#usernick) or a [`[Channel object]`](#channelname). 
If the message exceeds the Length of 512 Chars, it will be splitted into Multiple Lines.

```javascript
client.send('foo', 'Why hello there');
client.send('#foo', 'Why hello there');
client.send(client.getUser('foo'), 'Why hello there');
client.send(client.getChannel('#foo'), 'Why hello there');
```

___
#### `notice(target, msg, fn)` 
Send a `msg` as a notice to the `target`.
`target` can either be a string, a [`[User object]`](#usernick) or a [`[Channel object]`](#channelname).
If the message exceeds the Length of 512 Chars, it will be splitted into Multiple Lines.

```javascript
client.notice('foo', 'Why hello there');
client.notice('#foo', 'Why hello there');
client.notice(client.getUser('foo'), 'Why hello there');
client.notice(client.getChannel('#foo'), 'Why hello there');
```

___
#### `join(channels, fn)`
Join channel(s). `channels` can either be a string, or an array.

```javascript
client.join('#foo');
client.join(['#foo', '#bar']);
```

___
#### `part(channels, msg, fn)`
Leave channel(s) with optional `msg`. 
`channels` can either be a string, or an array.

```javascript
client.part('#foo', 'So long');
client.part(['#foo', '#bar']);
```

___
#### `topic(channel, topic, fn)`
Change or view the Topic of `channel`.
`channel` can either be a string or a [`[Channel object]`](#channelname). 
If the `topic` parameter is present, the topic for `channel` will be changed. If the `topic` parameter is an empty string, the topic for that channel will be removed.

```javascript
client.topic('#foo', 'So long');
client.topic(client.getChannel('#foo'));
```

___
#### `kick(channels, nicks, msg, fn)`
Kick nick(s) from channel(s) with optional `msg`.
`channels` can either be a string, or an array.
`nicks` can either be a string, or an array.

```javascript
client.kick('#foo', 'bar', 'So Long');
client.kick(['#foo', '#bar'], 'bar', 'So Long');
client.kick(['#foo', '#bar'], ['foo', 'bar'], 'So Long');
```

___
#### `quit(msg, fn)`
Disconnect from the server with optional `msg`.

```javascript
client.quit('So Long');
```

___
#### `oper(name, password, fn)`
Used to obtain operator privileges. 
The combination of `name` and `password` are required to gain Operator privileges.
Upon success, a `'mode'` event will be emitted.

```javascript
client.oper('foo', 'bar');
```

___
#### `mode(target, flags, params, fn)`
Used to set a user's mode or channel's mode for a user.
`target` can either be a string, a [`[User object]`](#usernick) or a [`[Channel object]`](#channelname).

```javascript
client.mode('#foo', '+o', 'bar');
client.mode(client.getChannel('#foo'), '+o', 'bar');
```

___
#### `names(channel, fn)`
Fetch names for `channel` and invoke `fn(names)`.

`channel` can either be a string or a [`[Channel object]`](#channelname).

See [`names`](#names-event) for what `names` will look like.

___
#### `use(fn)`
Use the given plugin `fn`.

```javascript
client.use(require('./plugins/foo')());
```

___
#### `getServerInfo()`
Returns the Info we recieved in the `RPL_YOURHOST`, `RPL_CREATED` & `RPL_ISUPPORT` messages as an object. The object might look something like this:

```javascript
{
    "servername": 'irc.foo.bar',
    "version": 'InspIRCd-2.0',
    "created": [Date object],
    "supports": {
        "AWAYLEN": "200",
        "CASEMAPPING": "rfc1459",
        "CHANMODES": "beg,k,FJLfjl,ABMRScimnprstz"
        "CHARSET": "ascii"
        //[...]
    }
}
```

___
#### `whois(target, fn)`
Used to query for whois info of `target` and invoke `fn(err, data)`. If `fn` is not given, the method will call the [whois event](#whois-err-data).

See [`whois`](#whois-err-data) for what `data` will look like.

```javascript
client.whois('foo');
client.whois('foo', function (err, data) {
    //process data.
});
```


___

## Events

#### "away" `(event)`
[`Client`](#clientstream) will emit `away` when we recieve the `RPL_AWAY` message, which happens either when we sent a PRIVMSG to a client which is away, or when we query WHOIS information about particular user.

`event.user` is a [`[User object]`](#usernick), representing the user who is away.
`event.message` is the away message.

```javascript
client.on('away', function (event) {
    console.log(event.user.getNick() + ' is away: ' + event.message); 
});
```

___

#### "data" `(parsed)`
[`Client`](#clientstream) will emit `data` whenever we recieve a line from the server. 

`parsed` is the parsed message as an object, containing prefix, command, params, trailing and the original string.

```javascript
client.on('data', function (parsed) {
    /*
    Original Message:
    :hitchcock.freenode.net NOTICE * :*** Looking up your hostname...\r\n
    Parsed object:
    {
        "prefix": "hitchcock.freenode.net",
        "command": "NOTICE",
        "params": "*"
        "trailing": "*** Looking up your hostname..."
        "string": ":hitchcock.freenode.net NOTICE * :*** Looking up your hostname..."
    }
    */
});
```

___

#### "invite" `(event)`
[`Client`](#clientstream) will emit `invite` when we recieve the `INVITE` message, which happens when we invite someone or when we get invited.

`event.channel` is a [`[Channel object]`](#channelname), representing the Channel where `event.user` got invited to.
`event.user` is a [`[User object]`](#usernick), representing the user who sent the invite.
`event.target` is a [`[User object]`](#usernick), representing the user who got invited.

```javascript
client.on('invite', function (event) {
    console.log(event.target.getNick() + ' got invited to join ' + event.channel.getName()); 
});
```

___

#### "join" `(event)`
[`Client`](#clientstream) will emit `join` when we recieve the `JOIN` message, which happens when someone (possibly us) joins a channel.

`event.user` is a [`[User object]`](#usernick), representing the user who joined `event.channel`.
`event.channel` is a [`[Channel object]`](#channelname), representing the Channel where `event.user` joined.

```javascript
client.on('join', function (event) {
    console.log(event.user.getNick() + ' joined ' + event.channel.getName()); 
});
```

___

#### "kick" `(event)`
[`Client`](#clientstream) will emit `kick` when we recieve the `KICK` message, which happens when someone gets kicked out of a channel.

`event.channel` is a [`[Channel object]`](#channelname), representing the Channel where someone got kicked.
`event.user` is a [`[User object]`](#usernick), representing the user who got kicked.
`event.by` is a [`[User object]`](#usernick), representing the user who kicked `event.user`.
`event.reason` is either the comment, or the nick of `event.user`.

```javascript
client.on('kick', function (event) {
    console.log(event.by.getNick() + ' kicked ' + event.user.getNick() + ' from ' + event.channel.getName() + '. Reason: ' + event.reason); 
});
```

___

#### "mode" `(event)`
[`Client`](#clientstream) will emit `mode` when we recieve the `MODE` message, which happens when someone changes the mode of a user or a channel.

`event.channel` is either a [`[Channel object]`](#channelname), representing the channel which the mode is being set on/in, or `null` when a user mode was changed.
`event.by` is either a [`[User object]`](#usernick), representing the user setting the mode, or a string if the mode was not changed by a user.
`event.argument` is the nick of the user, if the mode is being set on a user, or null if there was no argument.
`event.adding` is either `true` of `false`, depending on if the mode was set or removed.
`event.mode` is the single character mode indentifier.

```javascript
client.on('mode', function (event) {
    console.log('[' + event.channel.getName() + '] ' + event.by.getNick() + ' sets the mode ' + (event.adding ? '+' : '-') + event.mode + ' on ' + event.argument); 
});
```

___

#### "motd" `(motd)`
[`Client`](#clientstream) will emit `motd` after we recieve the `RPL_ENDOFMOTD` or `ERR_NOMOTD` message, which happens when we connect to a server.

`motd` the the Message of the Day the server sent, as **array**, seperated by line. Starting with
> foo.bar.net message of the day

and ending with
>End of message of the day.

```javascript
client.on('motd', function (motd) {
    motd.forEach(function (line) {
        console.log('[MOTD]' + motd);
    });
});
```

___

#### "names" `(event)`
[`Client`](#clientstream) will emit `names` after we recieve the `RPL_ENDOFNAMES` message, which happens after we joined a channel.

`event.channel` is a [`[Channel object]`](#channelname) representing the channel.
`event.names` is an object where the key is a nick, and the value an array of modes the user has in the channel.

`event.names` will look something like this:


```javascript
{
    "foo": [],
    "bar": ['~', '@']
    "baz": ['@']
}
```

___

#### "nick" `(event)`
[`Client`](#clientstream) will emit `nick` after we recieve the `NICK` message, which happens when a user (propably us) changes his nick.

`event.user` is a [`[User object]`](#usernick), representing the user who changed his nick.
`event.oldNick` is the old nick of the user as a string.

```javascript
client.on('nick', function (event) {
    console.log(event.oldNick + ' is now known as ' + event.user.getNick());
});
```

___

#### "notice" `(event)`
[`Client`](#clientstream) will emit `notice` after we recieve the `NOTICE` message, which happens when someone sent a notice to us, or to a channel.

`event.from` is either a [`[User object]`](#usernick), representing the user who sent the notice, or a string if its not sent by a user (e.g the server).
`event.to` is the recipient of the notice as a string.
`event.message` is the message.

```javascript
client.on('notice', function (event) {
    console.log(event.from + ' => ' event.to + ': ' + event.message);
});
```

___

#### "part" `(event)`
[`Client`](#clientstream) will emit `part` after we recieve the `PART` message, which happens when someone leave one or multiple channels.

`event.user` is a [`[User object]`](#usernick), representing the user who left the channel.
`event.channels` is an array of [`[Channel object]`](#channelname) with the the channels the user left.
`event.message` is the message the user sent when leaving the channels.

```javascript
client.on('part', function (event) {
    console.log(event.user.getNick() + ' left ' + event.channels.join(', ') + '. Message: ' + event.message);
});
```

___

#### "ping"
[`Client`](#clientstream) will emit `ping` after we recieve the `PING` message, which happens at regular intervals if no other activity detected coming from a connection.

Please note that the `PONG` reply is sent automatically.

```javascript
client.on('ping', function () {
    console.log('PONG \o/');
});
```

___

#### "message" `(event)`
[`Client`](#clientstream) will emit `message` after we recieve the `PRIVMSG` message which is sent to a channel.

`event.channel` is a [`[Channel object]`](#channelname), representing the channel which recieved the message.
`event.user` is a [`[User object]`](#usernick), representing the user who sent the message.
`event.message` is the message the user sent.
`event.isAction` is either `true` if the message was sent as an ACTION, or `false` if not.

```javascript
client.on('message', function (event) {
    if (event.isAction) {
        console.log('[' + event.channel.getName() '] * ' + event.user.getNick() + ' ' + event.message);
    } else {
        console.log('[' + event.channel.getName() '] ' + event.user.getNick() + ': ' + event.message);
    }
});
```

___

#### "privatemessage" `(event)`
[`Client`](#clientstream) will emit `privatemessage` after we recieve the `PRIVMSG` message which is sent to us.

`event.user` is a [`[User object]`](#usernick), representing the user who sent the message.
`event.message` is the message the user sent.
`event.isAction` is either `true` if the message was sent as an ACTION, or `false` if not.

```javascript
client.on('privatemessage', function (event) {
    if (event.isAction) {
        console.log('[PM] * ' + event.user.getNick() + ' ' + event.message);
    } else {
        console.log('[PM] ' + event.user.getNick() + ': ' + event.message);
    }
});
```

___

#### "quit" `(event)`
[`Client`](#clientstream) will emit `quit` after we recieve the `QUIT` message, which happens when someone leaves the server.

`event.user` is a [`[User object]`](#usernick), representing the user who quit.
`event.message` is the message the user sent when leaving the server.

```javascript
client.on('quit', function (event) {
    console.log(event.user.getNick() + ' left the Server: ' + event.message);
});
```

___

#### "topic" `(event)`
[`Client`](#clientstream) will emit `topic` after we recieve the `RPL_TOPIC` message (which is sent after we join a channel), or after the topic got manually changed.

`event.channel` is a [`[Channel object]`](#channelname), representing the channel.
`event.user` is a [`[User object]`](#usernick), representing the user who changed/set the topic.
`event.topic` is the topic that was set as a string.
`event.time` is a `[Date object]` of the time the topic was changed.
`event.changed` is either `true` if the topic got changed, or `false` if we recieved the topic after we joined a channel.


```javascript
client.on('topic', function (event) {
    console.log('Topic for ' + event.channel.getName() + ' is: ' + event.topic);
    console.log('Topic for ' + event.channel.getName() + ' set by ' + event.user.getNick() + ' (' + event.time + ')');
});
```

___

#### "welcome" `(event)`
[`Client`](#clientstream) will emit `welcome` after we recieve the initial `RPL_WELCOME` message.

`event.nick` is a string with the nick we use.
`event.message` is the welcome message the server sent to us.


```javascript
client.on('welcome', function (event) {
    console.log('Welcome, ' + event.nick + '! ' + event.message);
});
```

___

#### "welcome" `(event)`
[`Client`](#clientstream) will emit `welcome` after we recieve the initial `RPL_WELCOME` message.

`event.nick` is a string with the nick we use.
`event.message` is the welcome message the server sent to us.


```javascript
client.on('welcome', function (event) {
    console.log('Welcome, ' + event.nick + '! ' + event.message);
});
```

___

#### "whois" `(err, data)`
[`Client`](#clientstream) will emit `whois` after we recieve the final `RPL_ENDOFWHOIS`, `ERR_NEEDMOREPARAMS`, `ERR_NOSUCHSERVER`, or `ERR_NOSUCHNICK` message. The data depends on the information the server sent to us.

`event.nick` is a string with the nick we use.
`event.message` is the welcome message the server sent to us.


```javascript
client.on('whois', function (err, data) {
    //err === null || err === 'No such nick/channel' || err === 'No such server' || err === 'Not enough parameters'
    //data = [Object object]
});
```

`data` might look like this:

```javascript
{
    "nick": "foo",
    "username": "bar",
    "hostname": "some.host",
    "realname": "baz",
    "channels": {
        "#foo": [],
        "#bar": ['~', '@'],
        "&baz": ['%']
    },
    "server": "some.irc.server",
    "serverInfo": "Server Info",
    "idle": 1076,
    "signon": [Date object],
    "oper": true,
    "account": "foo",
    "registered": true,
    "secure": true
}
```

___
### `User(nick, client)`
Represents a User by the given nick. 
Please use `client.getUser('some_nick')` to get a User object, and not `new User('some_nick', client)`.
Please note that most of these information is recieved through parsing the [`whois`](#whois-err-data) event data. Coffea itself won't whois automatically, so you have to do it yourself in order to get these information.

___
#### `toString()`
Returns the User as a string with the format `nick!username@hostname`.

```javascript
console.log(user.toString());
//some_nick!user_name@host.com

console.log(user);
//some_nick!user_name@host.com
```

___
#### `getNick()`
Get the Nickname of the User.

```javascript
console.log(user.getNick());
//some_nick
```

___
#### `getUsername()`
Get the Username of the User.

```javascript
console.log(user.getUsername());
//user_name
```

___
#### `getRealname()`
Get the Real name of the User.

```javascript
console.log(user.getRealname());
//Some Name
```

___
#### `getHostname()`
Get the Host of the User.

```javascript
console.log(user.getHostname());
//some.host.com
```

___
#### `getChannels()`
Get a List of Channels the user is currently in, with possible modes.

```javascript
console.log(user.getChannels());
//{'#foo': ['~'], '#bar': []}
```

___
#### `getServer()`
Get the Server the User is connected to.

```javascript
console.log(user.getServer());
//some.server.net
```

___
#### `getServerInfo()`
Get the Info message of the Server the user is connected to.

```javascript
console.log(user.getServerInfo());
//Lorem Ipsum
```

___
#### `getAway()`
Get the Away message of the user, or `null` if the User is not away.

```javascript
console.log(user.getAway());
//null
```

___
#### `getAccount()`
Get the Account the User is registered to, or `null` if the User is not registered/logged in.

```javascript
console.log(user.getAccount());
//foo
```

___
#### `isRegistered()`
Returns `true` if the User is Registered, `false` if not.

```javascript
console.log(user.isRegistered());
//true
```

___
#### `isUsingSecureConnection()`
Returns `true` if the User is Connected using SSL, `false` if not.

```javascript
console.log(user.isUsingSecureConnection());
//true
```

___
#### `getIdle()`
Get the Users idle time in seconds.

```javascript
console.log(user.getIdle());
//123
```

___
#### `getSignonTime()`
Get The Signon time as Date object.

```javascript
console.log(user.getSignonTime().getTime());
//1396293728439
```

___
#### `isOper()`
Returns `true` if the User is an IRC operator, `false` if not.

```javascript
console.log(user.isOper());
//false
```

___
#### `notice(msg)`
Sends a notice `msg` to the user.

```javascript
user.notice('Why hello there');
```

___
#### `say(msg)`
Sends a message `msg` to the user.

```javascript
user.say('Why hello there');
```

___
#### `whois(fn)`
Used to query for whois info of the user and invoke `fn(err, data)`.

See [`whois`](#whois-err-data) for what `data` will look like.

```javascript
user.whois(function (err, data) {
    //process data.
});
```

___
### `Channel(name, client)`
Represents a Channel by the given name. 
Please use `client.getChannel('#foo')` to get a Channel object, and not `new Channel('#foo', client)`.

___
#### `toString()`
Returns the Channel name.

```javascript
console.log(channel.toString());
//#foo
```

___
#### `getName()`
Returns the Channel name.

```javascript
console.log(channel.getName());
//#foo
```

___
#### `getTopic()`
Returns the Channel topic as object, containing the Topic itself, a [`User`](#usernick) object representing the User who set the Topic, and a Date object representing the time the topic was set.

```javascript
console.log(channel.getTopic());
//{
//    "topic": "The Channel topix goes here",
//    "user": [User object],
//    "time": [Date object]
//}
```

___
#### `getNames()`
Returns a List of Nicks that are currently in the channel, with possible modes.

```javascript
console.log(channel.getName());
//{'foo': ['~'], 'bar': ['%'], 'baz': []}
```

___
#### `userHasMode(user, mode)`
Returns `true` if `user` has the usermode `mode` in the channel, `false` if otherwise. `user` can either be a string or a [`[User object]`](#usernick).

```javascript
console.log(channel.userHasMode('foo', '~'));
//false
```

___
#### `isUserInChannel(user)`
Returns `true` if `user` is in the channel, `false` if otherwise. `user` can either be a string or a [`[User object]`](#usernick).

```javascript
console.log(channel.isUserInChannel('foo'));
//false
```

___
#### `notice(msg)`
Sends a notice `msg` to the channel.

```javascript
channel.notice('Why hello there');
```

___
#### `say(msg)`
Sends a message `msg` to the channel.

```javascript
channel.say('Why hello there');
```

___
#### `reply(user, msg)`
Sends a reply `msg` to a user into the channel. `user` can either be a string or a [`[User object]`](#usernick).

```javascript
channel.reply('foo', 'Why hello there');
//foo: Why hello there
```

___
#### `kick(user, reason)`
Kicks `user` out of the channel with the given reason. `user` can either be a string or a [`[User object]`](#usernick).

```javascript
channel.kick('foo', 'Get out!');
```

___
#### `ban(mask)`
Sets the mode `+b` for `mask` in the channel.

```javascript
channel.ban('foo!bar@baz.com');
```

___
#### `unban(mask)`
Sets the mode `-b` for `mask` in the channel.

```javascript
channel.unban('foo!bar@baz.com');
```