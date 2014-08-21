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

        irc.on('data', function (msg, network) {
            var match, supports;
            switch (msg.command) {
            case 'RPL_YOURHOST':
                match = msg.trailing.match(/^Your host is (.+), running version (.+)$/i);
                serverInfo[network] = serverInfo[network] || {};
                serverInfo[network].servername = match[1];
                serverInfo[network].version = match[2];
                break;
            case 'RPL_CREATED':
                serverInfo[network] = serverInfo[network] || {};
                serverInfo[network].created = new Date(msg.trailing.substr(24));
                break;
            /*case 'RPL_MYINFO':
                //http://i.imgur.com/fWVvVno.gif
                break;*/
            case 'RPL_ISUPPORT':
                serverInfo[network] = serverInfo[network] || {};
                serverInfo[network].supports = serverInfo[network].supports || {};
                supports = msg.params.split(' ');
                supports.shift();
                supports.forEach(function (s) {
                    if (s.indexOf('=') !== -1) {
                        serverInfo[network].supports[s.split('=')[0]] = s.split('=')[1];
                    } else {
                        serverInfo[network].supports[s] = true;
                    }
                });
                break;
            }
        });
    };
};
