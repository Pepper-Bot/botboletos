/** @type {Array} */
var _0x6b64 = [
    "request", //0
    "https://graph.facebook.com/v2.6/me/messages", //1
    "PAGE_ACCESS_TOKEN", //2
    "env", //3
    "POST", //4
    "template", //5
    "generic", //6
    "-----------------", //7
    "log", //8
    "button", //9
    "location", //10
    "mark_seen", //11
    "typing_off", //12
    "typing_on", //13
    "getTime", //14
    "exports" //15
];
var request = require('request');
var Message = require('../bot/messages');


function quickReply(senderId, messageText, replies) {
    request({
        url: _0x6b64[1],
        qs: {
            access_token: process[_0x6b64[3]][_0x6b64[2]]
        },
        method: _0x6b64[4],
        json: {
            "recipient": {
                "id": senderId
            },
            "message": {
                "text": messageText,
                "quick_replies": replies
            }
        }
    }, function (replies, deepreplies, ignoreMethodDoesntExist) {
        console.log("luis")
        if (replies) {
            return false;
        } else {
            return true;
        }
    });
}

function genericButtonQuickReplay(senderId, gButtons, messageText) {

    request({
        url: _0x6b64[1],
        qs: {
            access_token: process[_0x6b64[3]][_0x6b64[2]]
        },
        method: _0x6b64[4],
        json: {
            "recipient": {
                "id": senderId
            },
            "message": {
                "attachment": {
                    "type": _0x6b64[5],
                    "payload": {
                        "template_type": _0x6b64[6],
                        "elements": gButtons
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

        Message.typingOn(senderId);
        Message.markSeen(senderId);
        Message.typingOn(senderId);


        var replies = [{
                "content_type": "text",
                "title": "Show me more",
                "payload": "find_my_event_by_category"

            },
            {
                "content_type": "text",
                "title": "Search Event",
                "payload": "find_my_event_by_name"
            }
        ];
        quickReply(senderId, messageText, replies)
    });

}



module.exports = {
    genericButtonQuickReplay

}