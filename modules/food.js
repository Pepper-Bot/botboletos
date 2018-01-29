var zomato = require('zomato');

var zomatoClient = zomato.createClient({
    userKey: '2889c298c45512452b6b32e46df88ffa',
});


var getCuisines = (city_id = 0, lat = 0, lon = 0) => {
    let qs = {}

    if (city_id != 0) {
        qs = {
            city_id: city_id, //id of the city for which collections are needed 
            //lat: lat, //latitude 
            //lon: lon //longitude 
        }
    }

    if (lat != 0) {
        qs = {
            //city_id: city_id, //id of the city for which collections are needed 
            lat: lat, //latitude 
            lon: lon //longitude 
        }
    }


    return new Promise((resolve, reject) => {
        zomatoClient.getCuisines(qs, function (err, result) {
            if (!err) {
                resolve(result)

            } else {
                reject(err)
            }
        });

    });
}


var getCities = (q) => {
    var qs = {
        q: q, //query by city name 
        //lat: "28.613939", //latitude 
        /// lon: "77.209021", //longitude 
        //city_ids: "1,2,3", //comma separated city_ids value 
        count: "2" // number of maximum result to display 
    }
    return new Promise((resolve, reject) => {
        zomatoClient.getCities(qs, function (err, result) {
            if (!err) {
                resolve(result)
            } else {
                reject(err)
            }
          
        });
    });

}

var getCategories = (q) => {
    var qs = {
        q: q, //query by city name 
        //lat: "28.613939", //latitude 
        /// lon: "77.209021", //longitude 
        //city_ids: "1,2,3", //comma separated city_ids value 
        count: "2" // number of maximum result to display 
    }
    return new Promise((resolve, reject) => {
        zomatoClient.getCategories(null, function (err, result) {
            if (!err) {
                console.log(result);
            } else {
                console.log(err);
            }
        });
    });
}



var search = (q) => {
    let qs = {}
    qs = {
        entity_id: "36932", //location id 
        entity_type: "group", // location type (city,subzone,zone , landmark, metro,group) 
        q: "Cafe", //Search Keyword 
        lat: "28.613939", //latitude 
        lon: "77.209021", //longitude 
        count: "2", // number of maximum result to display 
        start: "1", //fetch results after offset 
        radius: "10000", //radius around (lat,lon); to define search area, defined in meters(M) 
        cuisines: "3,7", //list of cuisine id's separated by comma 
        establishment_type: "", //estblishment id obtained from establishments call 
        collection_id: "29", //collection id obtained from collections call 
        category: "9", //	category ids obtained from categories call 
        sort: " cost,rating,real_distance", //choose any one out of these available choices 
        order: "asc" //	used with 'sort' parameter to define ascending(asc )/ descending(desc) 

    }


    return new Promise((resolve, reject) => {
        zomatoClient.search(qs, function (err, result) {
            if (!err) {
                resolve(result)
            } else {
                reject(err)
            }
        })
    });
}




var get = function (Message, result, locationData) {
    var request = require('request');
    request({
        url: 'https://developers.zomato.com/api/v2.1/search',
        qs: {
            apikey: '2889c298c45512452b6b32e46df88ffa',
            count: "4",
            category: "2",
            sort: "rating",

            lat: locationData.payload.coordinates.lat,
            lon: locationData.payload.coordinates.long
            /*
                                            "lat": "40.742051",
                                            "lon": "-74.004821"*/
        },
        method: 'GET'
    }, function (error, response, body) {

        if (error) {



            Message.markSeen(result.fbId);
            Message.typingOn(result.fbId);
            //sleep(2000);
            var replies = [];

            replies.push({
                "content_type": "text",
                "title": "Yes",
                "payload": "TRYAGAIN_YES"
            });
            replies.push({
                "content_type": "text",
                "title": "No",
                "payload": "TRYAGAIN_NO"
            });
            Message.quickReply(result.fbId, 'Sorry, something went wrong with sending the location. Want to try again?', replies);


        } else {
            try {
                var json = JSON.parse(body);
                if (json.results_found > 0) {
                    console.log('Estos son los resultados:');
                    console.log(json);
                    Message.typingOn(result.fbId);
                    //sleep(2000);
                    Message.sendMessage(result.fbId, 'Check out these dine outs.');
                    Message.typingOff(result.fbId);

                    Message.typingOn(result.fbId);
                    //sleep(2000);
                    var eventResults = [];
                    for (var i = 0; i < 4; i++) {
                        eventResults.push({
                            "title": json.restaurants[i].restaurant.name,
                            "image_url": json.restaurants[i].restaurant.thumb,
                            "subtitle": json.restaurants[i].restaurant.cuisines,
                            "default_action": {
                                "type": "web_url",
                                "url": 'https://botboletos.herokuapp.com/redirect/?u=' + json.restaurants[i].restaurant.url + '&id=' + result.fbId
                                /*,
                                                                                      "messenger_extensions": true,
                                                                                      "webview_height_ratio": "tall",
                                                                                      "fallback_url": 'https://botboletos.herokuapp.com/redirect/?u='+json.restaurants[i].restaurant.url + '&id='+result.fbId*/
                            },
                            "buttons": [{
                                "type": "web_url",
                                "url": 'https://botboletos.herokuapp.com/redirect/?u=' + json.restaurants[i].restaurant.url + '&id=' + result.fbId,
                                "title": "Go"
                            }]
                        });

                    }

                    console.log('Resultados para button:');
                    console.log(eventResults);
                    console.log('Sender Id:' + result.fbId);
                    Message.genericButton(result.fbId, eventResults);
                    Message.typingOff(result.fbId);
                } else {

                    Message.markSeen(result.fbId);
                    Message.typingOn(result.fbId);
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
                    Message.quickReply(result.fbId, 'Sorry, something went wrong with sending the location. Want to try again?', replies);

                }
            } catch (e) {

                Message.markSeen(result.fbId);
                Message.typingOn(result.fbId);
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
                Message.quickReply(result.fbId, 'Sorry, something went wrong with sending the location. Want to try again?', replies);

            }

        }


    });

}

module.exports = {
    get
}