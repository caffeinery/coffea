/*jslint node: true*/
"use strict";

module.exports = function () {
    return function (irc) {
        /**
         * 005 RPL_ISUPPORT Support for coffea.
         *
         * This scans the 005 numeric request from the server when it
         * connects and sets settings in the client
         */
        irc.on('005', function (event) {
            /**
             * :weber.freenode.net 005 coffea CHANTYPES=# EXCEPTS INVEX CHANMODES=eIbq,k,flj,CFLMPQScgimnprstz CHANLIMIT=#:120 PREFIX=(ov)@+ MAXLIST=bqeI:100 MODES=4 NETWORK=freenode KNOCK STATUSMSG=@+ CALLERID=g :are supported by this server
             * :weber.freenode.net 005 coffea CASEMAPPING=rfc1459 CHARSET=ascii NICKLEN=16 CHANNELLEN=50 TOPICLEN=390 ETRACE CPRIVMSG CNOTICE DEAF=D MONITOR=100 FNC TARGMAX=NAMES:1,LIST:1,KICK:1,WHOIS:1,PRIVMSG:4,NOTICE:4,ACCEPT:,MONTIOR: :are supported by this server
             * :weber.freenode.net 005 coffea EXTBAN=$,ajrxz WHOX CLIENTVER=3.0 SAFELIST ELIST=CTU :are supported by this server
             */
            var settings = irc.settings[event.network];
            var data = event.params.replace(irc.getMe(event.network).nick, '');

            irc._parseIsupportData(data, function (key, value) {
                settings[key] = value;
            });
        });

        irc._parseIsupportData = function (data, cb) {
            var tmp, params, param, item;
            params = data.trim().split(' ');

            for (param in params) {
                if (params[param].match(/=/)) {
                    tmp = params[param].split('=');

                    var key = tmp[0].toLowerCase();
                    var val = irc._parseIsupportValue(tmp[1]);
                } else {
                    var key = params[param].toLowerCase();
                    var val = true;
                }

                cb(key, val);
            }
        };

        irc._parseIsupportValue = function (value) {
            var i, tmp;

            if (value.match(/,/)) {
                tmp = value.split(',');
                value = [];

                for (i in tmp) {
                    value.push(irc._parseIsupportValue(tmp[i]));
                }

                return value;
            } else if (value.match(/:/)) {
                tmp = value.split(':');
                value = {};

                value[tmp[0]] = tmp[1];

                return value;
            } else {
                return value;
            }
        }
    };
};
