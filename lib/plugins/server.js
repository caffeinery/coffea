/*jslint node: true, nomen: true, unparam: true*/
"use strict";

module.exports = function () {
    var serverInfo = {};
    return function (irc) {

        irc.getServerInfo = function () {
            return serverInfo;
        };

        irc.on('data', function (msg) {
            //console.log(msg);
            var match, supports;
            switch (msg.command) {
            case 'RPL_YOURHOST':
                match = msg.trailing.match(/^Your host is (.+), running version (.+)$/i);
                serverInfo.servername = match[1];
                serverInfo.version = match[2];
                break;
            case 'RPL_CREATED':
                serverInfo.created = new Date(msg.trailing.substr(24));
                break;
            /*case 'RPL_MYINFO':
                //http://i.imgur.com/fWVvVno.gif
                break;*/
            case 'RPL_ISUPPORT':
                serverInfo.supports = serverInfo.supports || {};
                supports = msg.params.split(' ');
                supports.shift();
                supports.forEach(function (s) {
                    if (s.indexOf('=') !== -1) {
                        serverInfo.supports[s.split('=')[0]] = s.split('=')[1];
                    } else {
                        serverInfo.supports[s] = true;
                    }
                });
                break;
            }
        });
    };
};