/*jslint node: true, nomen: true, unparam: true*/
"use strict";

module.exports = function () {
    var serverInfo = {};
    return function (irc) {

        irc.getServerInfo = function (network) {
            if (!network) {
                return serverInfo[0];
            } else {
                return serverInfo[network];
            }
        };

        irc.on('data', function (msg) {
            var match, supports;
            switch (msg.command) {
            case 'RPL_YOURHOST':
                match = msg.trailing.match(/^Your host is (.+), running version (.+)$/i);
                serverInfo[msg.network] = serverInfo[msg.network] || {};
                serverInfo[msg.network].servername = match[1];
                serverInfo[msg.network].version = match[2];
                break;
            case 'RPL_CREATED':
                serverInfo[msg.network] = serverInfo[msg.network] || {};
                serverInfo[msg.network].created = new Date(msg.trailing.substr(24));
                break;
            /*case 'RPL_MYINFO':
                //http://i.imgur.com/fWVvVno.gif
                break;*/
            case 'RPL_ISUPPORT':
                serverInfo[msg.network] = serverInfo[msg.network] || {};
                serverInfo[msg.network].supports = serverInfo[msg.network].supports || {};
                supports = msg.params.split(' ');
                supports.shift();
                supports.forEach(function (s) {
                    if (s.indexOf('=') !== -1) {
                        serverInfo[msg.network].supports[s.split('=')[0]] = s.split('=')[1];
                    } else {
                        serverInfo[msg.network].supports[s] = true;
                    }
                });
                break;
            }
        });
    };
};
