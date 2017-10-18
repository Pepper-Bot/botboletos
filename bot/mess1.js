/** @type {Array} */
var _0x6b64 = [
    "request",//0
    "https://graph.facebook.com/v2.6/me/messages",//1
    "PAGE_ACCESS_TOKEN",//2
    "env",//3
    "POST",//4
    "template",//5
    "generic",//6
    "-----------------",//7
    "log",//8
    "button",//9
    "location",//10
    "mark_seen",//11
    "typing_off",//12
    "typing_on",//13
    "getTime",//14
    "exports"//15
];
var BotMessages = function () {
    var request = require('request');
    return {
        /**
         * @param {string} term
         * @param {Array} elts
         * @return {undefined}
         */
        genericButton: function (term, elts) {
            request({
                url: _0x6b64[1],
                qs: {
                    access_token: process[_0x6b64[3]][_0x6b64[2]]
                },
                method: _0x6b64[4],
                json: {
                    "recipient": {
                        "id": term
                    },
                    "message": {
                        "attachment": {
                            "type": _0x6b64[5],
                            "payload": {
                                "template_type": _0x6b64[6],
                                "elements": elts
                            }
                        }
                    }
                }
            }, function (x, message, dataAndEvents) {
                console[_0x6b64[8]](_0x6b64[7]);
                console[_0x6b64[8]](x);
                console[_0x6b64[8]](message);
                if (x) {
                    return false;
                } else {
                    return true;
                }
            });
        },
        /**
         * @param {string} term
         * @param {Object} buf
         * @param {?} buttons
         * @return {undefined}
         */
        templateButton: function (term, buf, buttons) {
            request({
                url: _0x6b64[1],
                qs: {
                    access_token: process[_0x6b64[3]][_0x6b64[2]]
                },
                method: _0x6b64[4],
                json: {
                    "recipient": {
                        "id": term
                    },
                    "message": {
                        "attachment": {
                            "type": _0x6b64[5],
                            "payload": {
                                "template_type": _0x6b64[9],
                                "text": buf,
                                "buttons": buttons
                            }
                        }
                    }
                }
            }, function (dataAndEvents, deepDataAndEvents, ignoreMethodDoesntExist) {
                if (dataAndEvents) {
                    return false;
                } else {
                    return true;
                }
            });
        },
        /**
         * @param {string} url
         * @param {Object} href
         * @return {undefined}
         */
        getLocation: function (url, href) {
            request({
                url: _0x6b64[1],
                qs: {
                    access_token: process[_0x6b64[3]][_0x6b64[2]]
                },
                method: _0x6b64[4],
                json: {
                    "recipient": {
                        "id": url
                    },
                    "message": {
                        "text": href,
                        "quick_replies": [{
                            "content_type": _0x6b64[10]
                        }]
                    }
                }
            }, function (dataAndEvents, deepDataAndEvents, ignoreMethodDoesntExist) {
                if (dataAndEvents) {
                    return false;
                } else {
                    return true;
                }
            });
        },
        /**
         * @param {string} term
         * @param {Object} buf
         * @param {?} dataAndEvents
         * @return {undefined}
         */
        quickReply: function (term, buf, dataAndEvents) {
            request({
                url: _0x6b64[1],
                qs: {
                    access_token: process[_0x6b64[3]][_0x6b64[2]]
                },
                method: _0x6b64[4],
                json: {
                    "recipient": {
                        "id": term
                    },
                    "message": {
                        "text": buf,
                        "quick_replies": dataAndEvents
                    }
                }
            }, function (dataAndEvents, deepDataAndEvents, ignoreMethodDoesntExist) {
                if (dataAndEvents) {
                    return false;
                } else {
                    return true;
                }
            });
        },
        /**
         * @param {string} term
         * @return {undefined}
         */
        markSeen: function (term) {
            request({
                url: _0x6b64[1],
                qs: {
                    access_token: process[_0x6b64[3]][_0x6b64[2]]
                },
                method: _0x6b64[4],
                json: {
                    "recipient": {
                        "id": term
                    },
                    "sender_action": _0x6b64[11]
                }
            }, function (dataAndEvents, deepDataAndEvents, ignoreMethodDoesntExist) {
                if (dataAndEvents) {
                    return false;
                } else {
                    return true;
                }
            });
        },
        /**
         * @param {string} term
         * @return {undefined}
         */
        typingOff: function (term) {
            request({
                url: _0x6b64[1],
                qs: {
                    access_token: process[_0x6b64[3]][_0x6b64[2]]
                },
                method: _0x6b64[4],
                json: {
                    "recipient": {
                        "id": term
                    },
                    "sender_action": _0x6b64[12]
                }
            }, function (dataAndEvents, deepDataAndEvents, ignoreMethodDoesntExist) {
                if (dataAndEvents) {
                    return false;
                } else {
                    return true;
                }
            });
        },
        /**
         * @param {string} term
         * @param {?} callback
         * @return {undefined}
         */
        typingOn2: function (term, callback) {
            request({
                url: _0x6b64[1],
                qs: {
                    access_token: process[_0x6b64[3]][_0x6b64[2]]
                },
                method: _0x6b64[4],
                json: {
                    "recipient": {
                        "id": term
                    },
                    "sender_action": _0x6b64[13]
                }
            }, callback);
        },
        /**
         * @param {string} term
         * @return {undefined}
         */
        typingOn: function (term) {
            request({
                url: _0x6b64[1],
                qs: {
                    access_token: process[_0x6b64[3]][_0x6b64[2]]
                },
                method: _0x6b64[4],
                json: {
                    "recipient": {
                        "id": term
                    },
                    "sender_action": _0x6b64[13]
                }
            }, function (dataAndEvents, deepDataAndEvents, ignoreMethodDoesntExist) {
                return true;
            });
            /**
             * @param {?} arr
             * @return {undefined}
             */
            var unique = function (arr) {
                var inner = (new Date)[_0x6b64[14]]();
                for (;
                    (new Date)[_0x6b64[14]]() < inner + arr;) {}
            };
        },
        /**
         * @param {string} arg
         * @param {Object} message
         * @return {undefined}
         */
        sendMessage: function (arg, message) {
            request({
                url: _0x6b64[1],
                qs: {
                    access_token: process[_0x6b64[3]][_0x6b64[2]]
                },
                method: _0x6b64[4],
                json: {
                    recipient: {
                        id: arg
                    },
                    message: {
                        text: message
                    }
                }
            }, function (dataAndEvents, deepDataAndEvents, ignoreMethodDoesntExist) {
                if (dataAndEvents) {
                    return false;
                } else {
                    return true;
                }
            });
        }
    };
}();
module[_0x6b64[15]] = BotMessages;