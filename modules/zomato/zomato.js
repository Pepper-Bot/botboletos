var zomato = require('zomato');
var Message = require('../../bot/messages');
var APLICATION_URL_DOMAIN = require('../../config/config_vars').APLICATION_URL_DOMAIN;
var query = require('array-query');
var zomatoClient = zomato.createClient({
  userKey: '2889c298c45512452b6b32e46df88ffa',
});

var establishments = [{
  "establishment": {
    "id": 16,
    "name": "Casual Dining"
  }
}, {
  "establishment": {
    "id": 275,
    "name": "Pizzeria"
  }
}, {
  "establishment": {
    "id": 18,
    "name": "Fine Dining"
  }
}, {
  "establishment": {
    "id": 31,
    "name": "Bakery"
  }
}, {
  "establishment": {
    "id": 1,
    "name": "Café"
  }
}, {
  "establishment": {
    "id": 7,
    "name": "Bar"
  }
}, {
  "establishment": {
    "id": 5,
    "name": "Lounge"
  }
}, {
  "establishment": {
    "id": 281,
    "name": "Fast Food"
  }
}, {
  "establishment": {
    "id": 24,
    "name": "Deli"
  }
}, {
  "establishment": {
    "id": 271,
    "name": "Sandwich Shop"
  }
}, {
  "establishment": {
    "id": 295,
    "name": "Noodle Shop"
  }
}, {
  "establishment": {
    "id": 6,
    "name": "Pub"
  }
}, {
  "establishment": {
    "id": 283,
    "name": "Brewery"
  }
}, {
  "establishment": {
    "id": 285,
    "name": "Fast Casual"
  }
}, {
  "establishment": {
    "id": 286,
    "name": "Coffee Shop"
  }
}, {
  "establishment": {
    "id": 81,
    "name": "Food Truck"
  }
}, {
  "establishment": {
    "id": 8,
    "name": "Club"
  }
}, {
  "establishment": {
    "id": 21,
    "name": "Quick Bites"
  }
}, {
  "establishment": {
    "id": 101,
    "name": "Diner"
  }
}, {
  "establishment": {
    "id": 278,
    "name": "Wine Bar"
  }
}, {
  "establishment": {
    "id": 91,
    "name": "Bistro"
  }
}, {
  "establishment": {
    "id": 23,
    "name": "Dessert Parlour"
  }
}, {
  "establishment": {
    "id": 20,
    "name": "Food Court"
  }
}, {
  "establishment": {
    "id": 282,
    "name": "Taqueria"
  }
}, {
  "establishment": {
    "id": 284,
    "name": "Juice Bar"
  }
}, {
  "establishment": {
    "id": 291,
    "name": "Sweet Shop"
  }
}, {
  "establishment": {
    "id": 41,
    "name": "Beverage Shop"
  }
}, {
  "establishment": {
    "id": 272,
    "name": "Cocktail Bar"
  }
}, {
  "establishment": {
    "id": 292,
    "name": "Beer Garden"
  }
}]

var getEstablishments = (city_id, establishment = '') => {
  let qs = {
    city_id: city_id, //id of the city for which collections are needed 
    //lat: "28.613939", //latitude 
    //lon: "77.209021" //longitude 
  }

  return new Promise((resolve, reject) => {
    zomatoClient.getEstablishments(qs, function (err, result) {
      if (!err) {
        let establishmentsResponse = JSON.parse(result);
        let establishments = establishmentsResponse.establishments
        console.log('establishments ' + JSON.stringify(establishments))
        //var allBakeries = query('establishment.name').is(establishment).on(establishments);
        let establecimiento = query('establishment.name').startsWith(establishment).or('establishment.name').endsWith(establishment).on(establishments);

        console.log('establecimiento > ' + JSON.stringify(establecimiento))


        resolve(establecimiento)
      } else {
        console.log(err);
        reject(err)
      }
    });
  });
}



var getCuisines = (city_id = 0, lat = 0, lon = 0, cuisine = '') => {
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
        let cuisinesR = JSON.parse(result);
        console.log('cuisines ' + JSON.stringify(cuisinesR))
        let cuisines = cuisinesR.cuisines

        console.log('cuisines ' + JSON.stringify(cuisines))


        console.log('getCityCuisineQs---->' + cuisine)
        if (cuisine == 'Spanish') {
          console.log('getCityCuisineQs---->' + 'Son iguales!!!' + cuisine)
        } else {
          console.log('getCityCuisineQs---->' + 'No Son iguales!!!' + cuisine)
        }
        let cocina = query('cuisine.cuisine_name').is('Spanish').on(cuisines);
        // let cocina = query('cuisine.cuisine_name').is(cuisine).on(cuisines);

        //let cocina = query('cuisine.cuisine_name').startsWith(cuisine).or('cuisine.cuisine_name').endsWith(cuisine).on(cuisines);


        console.log('cocina ' + JSON.stringify(cocina))
        resolve(cocina)

      } else {
        reject(err)
      }
    });

  });
}


var getCities = (city_name) => {
  var qs = {
    q: city_name, //query by city name 
    //lat: "28.613939", //latitude 
    /// lon: "77.209021", //longitude 
    //city_ids: "1,2,3", //comma separated city_ids value 
    count: "2" // number of maximum result to display   
  }
  return new Promise((resolve, reject) => {
    zomatoClient.getCities(qs, function (err, result) {
      if (!err) {
        var citiesResponse = JSON.parse(result);
        resolve(citiesResponse)
      } else {
        reject(err)
      }

    });
  });

}

var getCityQs = (city_name) => {
  return new Promise((resolve, reject) => {
    getCities(city_name).then((cityResponse) => {
      console.log('cityResponse' + JSON.stringify(cityResponse))
      let city_id = cityResponse.location_suggestions[0].id
      let qs = {
        entity_id: city_id, //location id 
        entity_type: "city", // location type (city,subzone,zone , landmark, metro,group) 
        sort: " cost,rating,real_distance", //choose any one out of these available choices 
        order: "asc" //	used with 'sort' parameter to define ascending(asc )/ descending(desc) 
      }
      resolve(qs)
    })
  })
}

var getCityEstablishmentQs = (city_name, venue_type) => {
  return new Promise((resolve, reject) => {
    getCities(city_name).then((cityResponse) => {
      console.log('cityResponse' + JSON.stringify(cityResponse))
      let city_id = cityResponse.location_suggestions[0].id
      getEstablishments(city_id, venue_type).then((establishment_type) => {
        let qs = {
          entity_id: city_id, //location id 
          entity_type: "city", // location type (city,subzone,zone , landmark, metro,group) 
          establishment_type: establishment_type.id,
          sort: " cost,rating,real_distance", //choose any one out of these available choices 
          order: "asc" //	used with 'sort' parameter to define ascending(asc )/ descending(desc) 
        }
        resolve(qs)
      })
    })
  })
}



var getCityCuisineQs = (city_name, cuisine) => {
  return new Promise((resolve, reject) => {
    getCities(city_name).then((cityResponse) => {
      console.log('cityResponse' + JSON.stringify(cityResponse))
      let city_id = cityResponse.location_suggestions[0].id


      getCuisines(city_id, 0, 0, cuisine).then((cousineRes) => {
        let cuisine_id = cousineRes.cuisine.cuisine_id

        if (cuisine_id) {
          let qs = {
            entity_id: city_id, //location id 
            entity_type: "city", // location type (city,subzone,zone , landmark, metro,group) 
            cuisines: cuisine_id,
            sort: " cost,rating,real_distance", //choose any one out of these available choices 
            order: "asc" //	used with 'sort' parameter to define ascending(asc )/ descending(desc) 
          }
          resolve(qs)
        } else {

          console.log('error no tengo cuisine_id ')
        }

      })
    })
  })
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



var search = (qs) => {
  /*qs = {
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

  }*/
  return new Promise((resolve, reject) => {
    zomatoClient.search(qs, function (err, result) {
      if (!err) {
        var venuesResponse = JSON.parse(result);
        console.log('venuesResponse ' + JSON.stringify(venuesResponse))
        resolve(venuesResponse)
      } else {
        reject(err)
      }
    })
  });
}


var getTemplateBySearch = function (senderId, qs) {
  search(qs).then((json) => {

    if (json.results_found > 0) {
      console.log('Estos son los resultados:');
      console.log(json);
      Message.typingOn(senderId);
      //sleep(2000);
      Message.sendMessage(senderId, 'Check out these dine outs.');
      Message.typingOff(senderId);

      Message.typingOn(senderId);
      //sleep(2000);
      var eventResults = [];
      for (var i = 0; i < 4; i++) {
        eventResults.push({
          "title": json.restaurants[i].restaurant.name,
          "image_url": json.restaurants[i].restaurant.thumb,
          "subtitle": json.restaurants[i].restaurant.cuisines,
          "default_action": {
            "type": "web_url",
            "url": APLICATION_URL_DOMAIN + 'redirect/?u=' + json.restaurants[i].restaurant.url + '&id=' + senderId
            /*,
                                                                  "messenger_extensions": true,
                                                                  "webview_height_ratio": "tall",
                                                                  "fallback_url": 'https://botboletos.herokuapp.com/redirect/?u='+json.restaurants[i].restaurant.url + '&id='+result.fbId*/
          },
          "buttons": [{
            "type": "web_url",
            "url": APLICATION_URL_DOMAIN + 'redirect/?u=' + json.restaurants[i].restaurant.url + '&id=' + senderId,
            "title": "Go"
          }]
        });

      }

      console.log('Resultados para button:');
      console.log(eventResults);
      console.log('Sender Id:' + senderId);
      Message.genericButton(senderId, eventResults);
      Message.typingOff(senderId);
    } else {
      console.log('zomato venues not found ')
    }




  }).catch((err) => {
    console.log('Error en la función getTemplateBySearch' + err)

  })

}




var start = function (Message, result, locationData) {
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

  getCityQs,
  getCityEstablishmentQs,
  getCityCuisineQs



}