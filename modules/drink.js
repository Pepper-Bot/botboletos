module.exports = function()
{

	return {

		get: function(Message, result, locationData)
		{
			var request = require('request');
			

                        request({
                            url: 'https://developers.zomato.com/api/v2.1/search',
                            qs: {
                                apikey: '2889c298c45512452b6b32e46df88ffa',
                                count: "4",
                                category: "3",
                                sort: "rating",
                                lat: locationData.payload.coordinates.lat,
                                lon: locationData.payload.coordinates.long

                                /*"lat": "40.742051",
                                "lon": "-74.004821"*/
                            },
                            method: 'GET'
                        }, function(error, response, body) {

                            if (error) {
                               


                                Message.markSeen(result.fbId);
                                Message.typingOn(result.fbId);
                                 //sleep(2000);
                                var replies = [{
                                    "content_type":"text",
                                    "title":"Yes",
                                    "payload":"TRYAGAIN_YES"
                                   
                                },
                                {
                                    "content_type":"text",
                                    "title":"No",
                                    "payload":"TRYAGAIN_NO"
                                }];
                                Message.quickReply(result.fbId, 'Sorry, something went wrong with sending the location. Want to try again?', replies);
                                Message.typingOff(result.fbId);
               
                            } else {
                                try {
                                    var json = JSON.parse(body);
                                    if(json.results_found >0)
                                    {
                                        console.log('Estos son los resultados:');
                                        console.log(json);
                                        Message.typingOn(result.fbId);
                                         //sleep(2000);
                                        Message.sendMessage(result.fbId, 'Check out these nightlife spots');
                                        Message.typingOff(result.fbId);

                                        Message.typingOn(result.fbId);
                                        var eventResults = [];
                                        for (var i = 0; i < 4; i++) {
                                            eventResults.push({
                                                "title":json.restaurants[i].restaurant.name,
                                                "image_url":json.restaurants[i].restaurant.thumb,
                                                "subtitle": json.restaurants[i].restaurant.cuisines,
                                                "default_action": {
                                                  "type": "web_url",
                                                  "url": 'https://botboletos.herokuapp.com/redirect/?u='+json.restaurants[i].restaurant.url + '&id='+result.fbId/*,
                                                  "messenger_extensions": true,
                                                  "webview_height_ratio": "tall",
                                                  "fallback_url":'https://botboletos.herokuapp.com/redirect/?u='+json.restaurants[i].restaurant.url + '&id='+result.fbId*/
                                                },
                                                "buttons":[
                                                  {
                                                    "type":"web_url",
                                                    "url": 'https://botboletos.herokuapp.com/redirect/?u='+json.restaurants[i].restaurant.url + '&id='+result.fbId,
                                                    "title":"Go"
                                                  }           
                                                ]      
                                            });

                                        }

                                        console.log('Resultados para button:');
                                        console.log(eventResults);
                                        console.log('Sender Id:'+ result.fbId);
                                        Message.genericButton(result.fbId, eventResults);
                                        Message.typingOff(result.fbId);
                                } else {

                                    Message.markSeen(result.fbId);

                                    Message.typingOn(result.fbId);
                                     //sleep(2000);
                                    var replies = [{
                                        "content_type":"text",
                                        "title":"Yes",
                                        "payload":"TRYAGAIN_YES"
                                       
                                    },
                                    {
                                        "content_type":"text",
                                        "title":"No",
                                        "payload":"TRYAGAIN_NO"
                                    }];
                                    Message.quickReply(result.fbId, 'Sorry, something went wrong with sending the location. Want to try again?', replies);
                                    Message.typingOff(result.fbId);

                                }
                                } catch (e) {
                                    
                                    Message.markSeen(result.fbId);

                                    Message.typingOn(result.fbId);
                                     //sleep(2000);
                                    var replies = [{
                                        "content_type":"text",
                                        "title":"Yes",
                                        "payload":"TRYAGAIN_YES"
                                       
                                    },
                                    {
                                        "content_type":"text",
                                        "title":"No",
                                        "payload":"TRYAGAIN_NO"
                                    }];
                                    Message.quickReply(result.fbId, 'Sorry, something went wrong with sending the location. Want to try again?', replies);
                                    Message.typingOff(result.fbId);
                                }
                             
                            }
                          

                        });
		}
	}

}();