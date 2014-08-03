/*jslint node: true, nomen: true, unparam: true*/
"use strict";

module.exports = function () {
    var serverInfo = {};
    return function (irc) {

        irc.getServerInfo = function (stream_id) {
            return serverInfo[stream_id];
        };

        irc.on('data', function (msg, stream_id) {
            //console.log(msg);
            var match, supports;
            switch (msg.command) {
            case 'RPL_YOURHOST':
                match = msg.trailing.match(/^Your host is (.+), running version (.+)$/i);
                serverInfo[stream_id] = serverInfo[stream_id] || {};
                serverInfo[stream_id].servername = match[1];
                serverInfo[stream_id].version = match[2];
                break;
            case 'RPL_CREATED':
                serverInfo[stream_id] = serverInfo[stream_id] || {};
                serverInfo[stream_id].created = new Date(msg.trailing.substr(24));
                break;
            /*case 'RPL_MYINFO':
                //http://i.imgur.com/fWVvVno.gif
                break;*/
            case 'RPL_ISUPPORT':
                serverInfo[stream_id] = serverInfo[stream_id] || {};
                serverInfo[stream_id].supports = serverInfo[stream_id].supports || {};
                supports = msg.params.split(' ');
                supports.shift();
                supports.forEach(function (s) {
                    if (s.indexOf('=') !== -1) {
                        serverInfo[stream_id].supports[s.split('=')[0]] = s.split('=')[1];
                    } else {
                        serverInfo[stream_id].supports[s] = true;
                    }
                });
                break;
            }
        });
    };
};
