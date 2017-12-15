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
    }, function (error, response, body) {
        console.log(response)
        if (error) {
            console.log("MAL")
        } else {
            console.log("BIEN")
            //sendYoutubeVideo(senderId)
            //sendVideoMessage(senderId);
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
                        "image_aspect_ratio": "horizontal",
                        "elements": gButtons
                    }
                }
            }
        }
    }, function (error, response, body) {
        console.log(response);

        var replies = [{
                "content_type": "text",
                "title": "Show me more",
                "payload": "find_my_event_show_me_more"

            },
            {
                "content_type": "text",
                "title": "Search Event",
                "payload": "find_my_event_search_event"
            }
        ];
        quickReply(senderId, messageText, replies)
    });

}



function genericButtonAndTemplateButtons(senderId, gButtons, title_template) {
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
    }, function (error, response, body) {

        var buttons = [{
                "type": "postback",
                "title": "Show me more",
                "payload": "find_my_event_show_me_more"
            },
            {
                "type": "postback",
                "title": "Search Event",
                "payload": "find_my_event_search_event"
            }
        ];

        templateButton(senderId, title_template, buttons)
    });

}

function templateButton(senderId, title_template, buttons) {
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
                        "template_type": _0x6b64[9],
                        "text": title_template,
                        "buttons": buttons
                    }
                }
            }
        }
    }, function (error, response, body) {

    });
}



function sendVideoMessage(senderId) {
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
                    "type": "video",
                    "payload": {
                        "url": "https://botboletos-test.herokuapp.com/videos/transformer.mp4"
                    }
                }
            }
        }
    }, function (error, response, body) {
        console.log(response)
        if (error) {
            console.log("MAL")
        } else {
            console.log(" sendVideoMessage BIEN")
        }
    });
}






function sendImage(senderId, urlImage) {
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
                    "type": "image",
                    "payload": {
                        "url": urlImage,
                        "is_reusable": true
                    }
                }
            }
        }
    }, function (error, response, body) {
        console.log(response)
        if (error) {
            console.log("MAL")
        } else {
            console.log(" sendImage  BIEN")


        }
    });
}


function sendImageWithQuickReplay(senderId, urlImage, messageText) {
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
                    "type": "image",
                    "payload": {
                        "url": urlImage
                    }
                }
            }
        }
    }, function (error, response, body) {
        console.log(response)
        if (error) {
            console.log("MAL")
        } else {
            console.log(" sendImage  BIEN")
            var replies = [{
                    "content_type": "text",
                    "title": "Rigondeaux",
                    "payload": "Rigondeaux"

                },
                {
                    "content_type": "text",
                    "title": "Lomachenko",
                    "payload": "Lomachenko"
                }
            ];
            quickReply(senderId, messageText, replies)

        }
    });
}







function sendYoutubeVideo(senderId) {
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
                    "type": "template",
                    "payload": {
                        "template_type": "open_graph",
                        "elements": [{
                                "url": "https://www.youtube.com/watch?v=y9A1MEbgLyA"
                            }


                        ]
                    }
                }
            }
        }
    }, function (error, response, body) {
        console.log(response)
        if (error) {
            console.log("MAL")
        } else {
            console.log(" sendYoutubeVideo BIEN")
        }
    });

}




function listTemplateButtons(senderId, gButtons) {
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
                    "type": "template",
                    "payload": {
                        "template_type": "list",
                        "top_element_style": "compact",
                        "elements": gButtons
                    }
                }
            }
        }
    }, function (error, response, body) {
        console.log(response)
        if (error) {
            console.log("MAL")
        } else {
           
            console.log(" listTemplateButtons  BIEN")
        }

    });

}


function sendMessage(senderId, message) {
    request({
        url: _0x6b64[1],
        qs: {
            access_token: process[_0x6b64[3]][_0x6b64[2]]
        },
        method: _0x6b64[4],
        json: {
            recipient: {
                id: senderId
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


module.exports = {
    genericButtonQuickReplay,
    genericButtonAndTemplateButtons,
    sendVideoMessage,
    listTemplateButtons,
    sendImage,
    sendImageWithQuickReplay,
    sendMessage


}