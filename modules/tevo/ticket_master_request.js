module.exports = function () {
    return {

        get: function (Message, senderId, lat, lon) {
            var request = require('request');
            request({
                url: 'https://app.ticketmaster.com/discovery/v2/events.json',
                qs: {
                    apikey: 'ULaFlBKn8CB9ApkAns8kMhEe7p0uKNTE',
                    //latlong: '40.74205,-74.004821' 
                    radius: '300',
                    latlong: lat + ',' + lon
                },
                method: 'GET'
            }, function (error, response, body) {


                if (error) {



                    Message.markSeen(senderId);
                    Message.typingOn(senderId);
                    //sleep(2000);
                    var replies = [{
                            "content_type": "text",
                            "title": "Yes",
                            "payload": "TRYAGAIN_YES"

                        },
                        {
                            "content_type": "text",
                            "title": "No",
                            "payload": "TRYAGAIN_NO"
                        }
                    ];
                    Message.quickReply(senderId, 'Sorry, something went wrong with sending the location. Want to try again?', replies);


                } else {
                    try {
                        var json = JSON.parse(body);

                        console.log('Elementos totales:' + json.page.totalElements);
                        if (json.page.totalElements > 0) {
                            console.log('Estos son los resultados:');
                            console.log(json);



                            Message.typingOn(senderId);
                            //sleep(2000);
                            Message.sendMessage(senderId, 'Check out these events');
                            Message.typingOff(senderId);

                            Message.typingOn(senderId);
                            //sleep(2000);


                            var eventResults = [];
                            var eventURL = "";
                            for (var i = 0; i < 8; i++) {

                                eventURL = JSON.stringify(json._embedded.events[i].url);

                                eventURL = 'https://' + eventURL.substring(8);




                                console.log('###############################################');
                                console.log('URL DE EVENTO:' + eventURL);
                                console.log('###############################################');
                                eventResults.push({
                                    "title": json._embedded.events[i].name,
                                    "image_url": json._embedded.events[i].images[0].url,
                                    "subtitle": json._embedded.events[i].pleaseNote,
                                    "default_action": {
                                        "type": "web_url",
                                        "url": 'https://botboletos.herokuapp.com/redirect/?u=' + eventURL + '&id=' + senderId
                                        /*,
                                                                                      "messenger_extensions": true,
                                                                                      "webview_height_ratio": "tall",
                                                                                      "fallback_url": 'https://botboletos.herokuapp.com/redirect/?u='+eventURL+'&id='+senderId */
                                    },
                                    "buttons": [{
                                        "type": "web_url",
                                        "url": 'https://botboletos.herokuapp.com/redirect/?u=' + eventURL + '&id=' + senderId,
                                        "title": "Go"
                                    }]
                                });

                            }

                            console.log('Resultados para button:');
                            console.log(eventResults);
                            console.log('Sender Id:' + senderId);
                            Message.typingOn(senderId);
                            Message.genericButton(senderId, eventResults);
                            Message.typingOn(senderId);
                        } else {

                            Message.markSeen(senderId);
                            Message.typingOn(senderId);
                            //sleep(2000);
                            var replies = [{
                                    "content_type": "text",
                                    "title": "Yes",
                                    "payload": "TRYAGAIN_YES"

                                },
                                {
                                    "content_type": "text",
                                    "title": "No",
                                    "payload": "TRYAGAIN_NO"
                                }
                            ];
                            Message.quickReply(senderId, 'Sorry, something went wrong with sending the location. Want to try again?', replies);
                            Message.typingOff(senderId);
                        }
                    } catch (e) {

                        Message.markSeen(senderId);
                        Message.typingOn(senderId);
                        var replies = [{
                                "content_type": "text",
                                "title": "Yes",
                                "payload": "TRYAGAIN_YES"

                            },
                            {
                                "content_type": "text",
                                "title": "No",
                                "payload": "TRYAGAIN_NO"
                            }
                        ];
                        Message.quickReply(senderId, 'Sorry, something went wrong with sending the location. Want to try again?', replies);
                        Message.typingOff(senderId);
                    }

                }


            });


            console.log('End Events');
        }
    }

}();