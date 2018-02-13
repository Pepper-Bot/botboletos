var zomato = require('zomato');
var Message = require('../../bot/messages');
var Message_2 = require('../../bot/generic_buttton') // Define new card layout 
var APLICATION_URL_DOMAIN = require('../../config/config_vars').APLICATION_URL_DOMAIN;
var query = require('array-query');
var cuisineSchema = require('../../schemas/cuisine')
var cuisineQueries = require('../../schemas/queries/cuisine_queries')
var establishmentSchema = require('../../schemas/establishment')
var establishmentQueries = require('../../schemas/queries/establishment_queries')

var arraySort = require('array-sort');
var user_queries = require('../../schemas/queries/user_queries');
var UserData2 = require('../../schemas/userinfo');

var zomatoClient = zomato.createClient({
  userKey: '2889c298c45512452b6b32e46df88ffa',
});

var only_with = require('../../config/config_vars').only_with;
var tevo = require('../../config/config_vars').tevo;
var TevoModule = require('../../modules/query_tevo_request');
var TevoClient = require('ticketevolution-node');

const tevoClient = new TevoClient({
  apiToken: tevo.API_TOKEN,
  apiSecretKey: tevo.API_SECRET_KEY
});




var getEstablishments = (city_id, establishment = '', lat = 0, lon = 0) => {
  let qs = {}


  if (lat != 0 && lon != 0) {
    qs = {
      lat: lat, //latitude 
      lon: lon //longitude 
    }
  }



  if (city_id != 0) {
    qs = {
      city_id: city_id, //id of the city for which collections are needed 
      //lat: "28.613939", //latitude 
      //lon: "77.209021" //longitude 
    }
  }


  /*return new Promise((resolve, reject) => {
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
  });*/


  return new Promise((resolve, reject) => {
    zomatoClient.getEstablishments(qs, function (err, result) {
      if (!err) {
        let establishmentsR = JSON.parse(result);

        let establishments = establishmentsR.establishments

        //console.log('establishments ' + JSON.stringify(establishments))


        //let establecimiento = query('establishment.establishment_name').is(establishment).on(establishmentsR.establishments);
        // let establecimiento = query('establishment.establishment_name').is(establishment).on(establishments);


        establishmentQueries.getEstablishmentsForAI().then((establecimientosForAI) => {
          console.log('establecimientosForAI ' + JSON.stringify(establecimientosForAI))
        })

        establishmentQueries.getEstablishmentByName(establishment).then((establecimientoEncontrada) => {
          if (establecimientoEncontrada.length > 0) {
            console.log('establecimiento encontrada... >' + JSON.stringify(establecimientoEncontrada))
            resolve(establecimientoEncontrada)
          } else {
            for (let i = 0; i < establishments.length; i++) {
              establishmentQueries.getEstablishmentById(establishments[i].establishment.id).then((cusinesSalida) => {
                if (cusinesSalida) {
                  if (cusinesSalida.length <= 0) {
                    let v_establishmentSchema = new establishmentSchema; {
                      v_establishmentSchema.name = establishments[i].establishment.name;
                      v_establishmentSchema.id = establishments[i].establishment.id;
                      v_establishmentSchema.value = establishments[i].establishment.name;
                      v_establishmentSchema.synonyms.push(establishments[i].establishment.name)
                      v_establishmentSchema.save()
                    }
                  }
                } else {
                  let v_establishmentSchema = new establishmentSchema; {
                    v_establishmentSchema.name = establishments[i].establishment.name;
                    v_establishmentSchema.id = establishments[i].establishment.id;
                    v_establishmentSchema.value = establishments[i].establishment.name;
                    v_establishmentSchema.synonyms.push(establishments[i].establishment.name)
                    v_establishmentSchema.save()
                  }
                }
              })

              if (i == establishments.length - 1) {
                /*for (let j = 0; j < establishments.length; j++) {
                  if (establishments[j].establishment.establishment_name == establishment) {
                    console.log(establishments[j].establishment.establishment_name)
                    establecimiento.push(establishments[j])
                    console.log('establecimiento ' + JSON.stringify(establecimiento))
                    resolve(establecimiento)
                    break;
                  }*/

                establishmentQueries.getEstablishmentByName(establishment).then((establecimientoEncontrada) => {
                  console.log('establecimiento encontrada... >' + JSON.stringify(establecimientoEncontrada))
                  if (establecimientoEncontrada.length <= 0) {
                    establecimientoEncontrada.push({
                      id: 0,
                      name: '',
                    })

                  }
                  resolve(establecimientoEncontrada)
                })
              }

            }
          }
        })
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

        let cuisines = cuisinesR.cuisines

        //console.log('cuisines ' + JSON.stringify(cuisines))


        //let cocina = query('cuisine.cuisine_name').is(cuisine).on(cuisinesR.cuisines);
        // let cocina = query('cuisine.cuisine_name').is(cuisine).on(cuisines);


        cuisineQueries.getCuisinesForAI().then((cocinasForAI) => {
          //console.log('cocinasForAI ' + JSON.stringify(cocinasForAI))
        })

        cuisineQueries.getCuisineByName(cuisine).then((cocinaEncontrada) => {
          if (cocinaEncontrada.length > 0) {
            console.log('cocina encontrada... >' + JSON.stringify(cocinaEncontrada))
            resolve(cocinaEncontrada)
          } else {
            for (let i = 0; i < cuisines.length; i++) {
              cuisineQueries.getCuisineById(cuisines[i].cuisine.cuisine_id).then((cusinesSalida) => {
                if (cusinesSalida) {
                  if (cusinesSalida.length <= 0) {
                    let v_cuisineSchema = new cuisineSchema; {
                      v_cuisineSchema.name = cuisines[i].cuisine.cuisine_name;
                      v_cuisineSchema.id = cuisines[i].cuisine.cuisine_id;
                      v_cuisineSchema.value = cuisines[i].cuisine.cuisine_name;
                      v_cuisineSchema.synonyms.push(cuisines[i].cuisine.cuisine_name)
                      v_cuisineSchema.save()
                    }
                  }
                } else {
                  let v_cuisineSchema = new cuisineSchema; {
                    v_cuisineSchema.name = cuisines[i].cuisine.cuisine_name;
                    v_cuisineSchema.id = cuisines[i].cuisine.cuisine_id;
                    v_cuisineSchema.value = cuisines[i].cuisine.cuisine_name;
                    v_cuisineSchema.synonyms.push(cuisines[i].cuisine.cuisine_name)
                    v_cuisineSchema.save()
                  }
                }
              })

              if (i == cuisines.length - 1) {
                /*for (let j = 0; j < cuisines.length; j++) {
                  if (cuisines[j].cuisine.cuisine_name == cuisine) {
                    console.log(cuisines[j].cuisine.cuisine_name)
                    cocina.push(cuisines[j])
                    console.log('cocina ' + JSON.stringify(cocina))
                    resolve(cocina)
                    break;
                  }*/

                cuisineQueries.getCuisineByName(cuisine).then((cocinaEncontrada) => {
                  console.log('cocina encontrada... >' + JSON.stringify(cocinaEncontrada))
                  resolve(cocinaEncontrada)
                })
              }

            }
          }
        })
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
      //console.log('cityResponse' + JSON.stringify(cityResponse))
      let city_id = cityResponse.location_suggestions[0].id
      let qs = {
        entity_id: city_id, //location id 
        entity_type: "city", // location type (city,subzone,zone , landmark, metro,group) 
        sort: "rating", //cost,rating,real_distance choose any one out of these available choices 
        order: "desc" //	used with 'sort' parameter to define ascending(asc )/ descending(desc) 
      }
      resolve(qs)
    })
  })
}

var searchByCity = (city_id, priority = 1, start = 1, count = 9) => {
  return new Promise((resolve, reject) => {
    let qs = {
      priority: priority,
      start: start,
      count: count,
      entity_id: city_id, //location id 
      entity_type: "city", // location type (city,subzone,zone , landmark, metro,group) 
      sort: "rating", //cost,rating,real_distance choose any one out of these available choices 
      order: "desc" //	used with 'sort' parameter to define ascending(asc )/ descending(desc) 
    }
    resolve(qs)
  })
}



var getCityEstablishmentQs = (city_name, venue_type) => {
  return new Promise((resolve, reject) => {
    getCities(city_name).then((cityResponse) => {
      console.log('cityResponse' + JSON.stringify(cityResponse))
      let city_id = cityResponse.location_suggestions[0].id
      getEstablishments(city_id, venue_type).then((establishmentRes) => {
        let qs = {
          entity_id: city_id, //location id 
          entity_type: "city", // location type (city,subzone,zone , landmark, metro,group) 
          establishment_type: establishmentRes[0].id,
          sort: "rating", //cost,rating,real_distance choose any one out of these available choices 
          order: "desc" //	used with 'sort' parameter to define ascending(asc )/ descending(desc) 
        }
        resolve(qs)
      })
    })
  })
}





var searchByCityEstablishment = (city_id, venue_type, priority = 1, start = 1, count = 9) => {
  return new Promise((resolve, reject) => {
    getEstablishments(city_id, venue_type).then((establishmentRes) => {
      let qs = {
        priority: priority,
        start: start,
        count: count,
        entity_id: city_id, //location id 
        entity_type: "city", // location type (city,subzone,zone , landmark, metro,group) 
        establishment_type: establishmentRes[0].id,
        sort: "rating", //cost,rating,real_distance choose any one out of these available choices 
        order: "desc" //	used with 'sort' parameter to define ascending(asc )/ descending(desc) 
      }
      resolve(qs)
    })
  })
}

var searchByCityCuisineEstablishment = (city_id, venue_type, cuisine, priority = 1, start = 1, count = 9) => {
  return new Promise((resolve, reject) => {
    getEstablishments(city_id, venue_type).then((establishmentRes) => {
      getCuisines(city_id, 0, 0, cuisine).then((cousineRes) => {
        let cuisine_id = cousineRes[0].id

        let qs = {
          priority: priority,
          start: start,
          count: count,
          entity_id: city_id, //location id 
          entity_type: "city", // location type (city,subzone,zone , landmark, metro,group) 
          establishment_type: establishmentRes[0].id,
          cuisines: cuisine_id,
          sort: "rating", //cost,rating,real_distance choose any one out of these available choices 
          order: "desc" //	used with 'sort' parameter to define ascending(asc )/ descending(desc) 
        }
        resolve(qs)

      })
    })
  })
}

var searchByCityVenueTitleEstablishment = (city_id, venue_type, venue_title, priority = 1, start = 1, count = 9) => {
  return new Promise((resolve, reject) => {
    getEstablishments(city_id, venue_type).then((establishmentRes) => {
      let qs = {
        priority: priority,
        start: start,
        count: count,
        entity_id: city_id, //location id 
        entity_type: "city", // location type (city,subzone,zone , landmark, metro,group) 
        establishment_type: establishmentRes[0].id,
        q: venue_title,
        sort: "rating", //cost,rating,real_distance choose any one out of these available choices 
        order: "desc" //	used with 'sort' parameter to define ascending(asc )/ descending(desc) 
      }
      resolve(qs)
    })

  })
}


var searchByCityVenueTitleCusine = (city_id, venue_title, cuisine, priority = 1, start = 1, count = 9) => {
  return new Promise((resolve, reject) => {
    getCuisines(city_id, 0, 0, cuisine).then((cousineRes) => {
      let cuisine_id = cousineRes[0].id
      let qs = {
        priority: priority,
        start: start,
        count: count,
        entity_id: city_id, //location id 
        entity_type: "city", // location type (city,subzone,zone , landmark, metro,group) 
        q: venue_title,
        cuisines: cuisine_id,
        sort: "rating", //cost,rating,real_distance choose any one out of these available choices 
        order: "desc" //	used with 'sort' parameter to define ascending(asc )/ descending(desc) 
      }
      resolve(qs)
    })
  })
}

var searchByVenueTitleCusineAndCoordinates = (lat, lon, venue_title, cuisine, priority = 1, start = 1, count = 9) => {
  return new Promise((resolve, reject) => {
    getCuisines(city_id, 0, 0, cuisine).then((cousineRes) => {
      let cuisine_id = cousineRes[0].id
      let qs = {
        priority: priority,
        start: start,
        count: count,
        lat: lat,
        lon: lon,
        q: venue_title,
        cuisines: cuisine_id,
        sort: "rating", //cost,rating,real_distance choose any one out of these available choices 
        order: "desc" //	used with 'sort' parameter to define ascending(asc )/ descending(desc) 
      }
      resolve(qs)
    })
  })
}


var searchByEstablismentAndCoordinates = (lat, lon, venue_type, priority = 1, start = 1, count = 9) => {
  return new Promise((resolve, reject) => {
    getEstablishments(0, venue_type, lat, lon).then((establishmentRes) => {
      let qs = {
        priority: priority,
        start: start,
        count: count,
        lat: lat, //latitude 
        lon: lon, //longitude 
        establishment_type: establishmentRes[0].id,
        sort: "rating", //cost,rating,real_distance choose any one out of these available choices 
        order: "desc" //	used with 'sort' parameter to define ascending(asc )/ descending(desc) 
      }
      resolve(qs)
    })

  })
}

var searchByCuisineEstablishmentAndCoordinates = (lat, lon, cuisine, venue_type, priority = 1, start = 1, count = 9) => {
  return new Promise((resolve, reject) => {
    getEstablishments(0, lat, lon, venue_type).then((establishmentRes) => {
      getCuisines(0, lat, lon, cuisine).then((cousineRes) => {
        let cuisine_id = cousineRes[0].id
        let qs = {
          priority: priority,
          start: start,
          count: count,
          entity_id: city_id, //location id 
          entity_type: "city", // location type (city,subzone,zone , landmark, metro,group) 
          establishment_type: establishmentRes[0].id,
          cuisines: cuisine_id,
          sort: "rating", //cost,rating,real_distance choose any one out of these available choices 
          order: "desc" //	used with 'sort' parameter to define ascending(asc )/ descending(desc) 
        }
        resolve(qs)

      })
    })
  })
}


var searchByVenueTitleEstablishmentAndCoordinates = (lat, lon, venue_type, venue_title, priority, start = 1, count = 9) => {
  return new Promise((resolve, reject) => {
    getEstablishments(city_id, venue_type).then((establishmentRes) => {
      let qs = {
        priority: priority,
        start: start,
        count: count,
        lat: lat,
        lon: lon,
        establishment_type: establishmentRes[0].id,
        q: venue_title,
        sort: "rating", //cost,rating,real_distance choose any one out of these available choices 
        order: "desc" //	used with 'sort' parameter to define ascending(asc )/ descending(desc) 
      }
      resolve(qs)
    })
  })
}





var getCityCuisineQs = (city_name, cuisine) => {
  return new Promise((resolve, reject) => {
    getCities(city_name).then((cityResponse) => {
      console.log('cityResponse' + JSON.stringify(cityResponse))
      let city_id = cityResponse.location_suggestions[0].id
      getCuisines(city_id, 0, 0, cuisine).then((cousineRes) => {
        if (cousineRes.length > 0) {
          //let cuisine_id = cousineRes[0].cuisine.cuisine_id
          let cuisine_id = cousineRes[0].id
          if (cuisine_id) {
            let qs = {
              entity_id: city_id, //location id 
              entity_type: "city", // location type (city,subzone,zone , landmark, metro,group) 
              cuisines: cuisine_id,
              sort: "rating", //cost,rating,real_distance choose any one out of these available choices 
              order: "desc" //	used with 'sort' parameter to define ascending(asc )/ descending(desc) 
            }
            resolve(qs)

            console.log('qs ' + JSON.stringify(qs))

          } else {
            console.log('error no tengo cuisine_id ')
            resolve({})
          }
        } else {
          console.log('error no tengo cuisine_id ')
          resolve({})
        }
      })
    })
  })
}


var searchByCityCuisine = (city_id, cuisine, priority = 1, start = 1, count = 9) => {
  return new Promise((resolve, reject) => {
    getCuisines(city_id, 0, 0, cuisine).then((cousineRes) => {
      if (cousineRes.length > 0) {
        //let cuisine_id = cousineRes[0].cuisine.cuisine_id
        let cuisine_id = cousineRes[0].id
        if (cuisine_id) {
          let qs = {
            priority: priority,
            start: start,
            count: count,
            entity_id: city_id, //location id 
            entity_type: "city", // location type (city,subzone,zone , landmark, metro,group) 
            cuisines: cuisine_id,
            sort: "rating", //cost,rating,real_distance choose any one out of these available choices 
            order: "desc" //	used with 'sort' parameter to define ascending(asc )/ descending(desc) 
          }
          resolve(qs)

          console.log('qs ' + JSON.stringify(qs))

        } else {
          console.log('error no tengo cuisine_id ')
          resolve({})
        }
      } else {
        console.log('error no tengo cuisine_id ')
        resolve({})
      }
    })
  })
}



var searchByCuisineAndCoordinates = (cuisine, lat = 0, lon = 0, priority = 1, start = 1, count = 9) => {
  return new Promise((resolve, reject) => {
    getCuisines(0, lat, lon, cuisine).then((cousineRes) => {
      if (cousineRes.length > 0) {
        //let cuisine_id = cousineRes[0].cuisine.cuisine_id
        let cuisine_id = cousineRes[0].id
        if (cuisine_id) {
          let qs = {
            priority: priority,
            start: start,
            count: count,
            lat: lat,
            lon: lot,
            cuisines: cuisine_id,
            sort: "rating", //cost,rating,real_distance choose any one out of these available choices 
            order: "desc" //	used with 'sort' parameter to define ascending(asc )/ descending(desc) 
          }
          resolve(qs)

          console.log('qs ' + JSON.stringify(qs))

        } else {
          console.log('error no tengo cuisine_id ')
          resolve({})
        }
      } else {
        console.log('error no tengo cuisine_id ')
        resolve({})
      }


    })

  })
}



var getCityVenueTitleQs = (city_name, venue_title) => {
  return new Promise((resolve, reject) => {
    getCities(city_name).then((cityResponse) => {
      let city_id = cityResponse.location_suggestions[0].id
      let qs = {
        entity_id: city_id, //location id 
        entity_type: "city",
        q: venue_title,
        sort: "rating", //cost,rating,real_distance choose any one out of these available choices 
        order: "desc" //	used with 'sort' parameter to define ascending(asc )/ descending(desc) 
      }
      resolve(qs)
    })
  })
}

var searchByCityVenueTitle = (city_id, venue_title, priority = 1, start = 1, count = 9) => {
  return new Promise((resolve, reject) => {
    let qs = {
      priority: priority,
      start: start,
      count: count,
      entity_id: city_id, //location id 
      entity_type: "city",
      q: venue_title,
      sort: "rating", //cost,rating,real_distance choose any one out of these available choices 
      order: "desc" //	used with 'sort' parameter to define ascending(asc )/ descending(desc) 
    }
    resolve(qs)
  })
}




var searchByVenueTitleAndCoordinates = (venue_title, lat, lon, priority, start = 1, count = 9) => {
  return new Promise((resolve, reject) => {
    let qs = {
      priority: priority,
      start: start,
      count: count,
      lat: lat,
      lon: lon,
      q: venue_title,
      sort: "rating", //cost,rating,real_distance choose any one out of these available choices 
      order: "desc" //	used with 'sort' parameter to define ascending(asc )/ descending(desc) 
    }
    resolve(qs)
  })
}

var searchByCoordinates = (lat, lon, priority = 1, start = 1, count = 9) => {
  return new Promise((resolve, reject) => {
    let qs = {
      priority: priority,
      start: start,
      count: count,
      lat: lat,
      lon: lon,
      sort: "rating", //cost,rating,real_distance choose any one out of these available choices 
      order: "desc" //	used with 'sort' parameter to define ascending(asc )/ descending(desc) 
    }
    resolve(qs)
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
      order: "desc" //	used with 'sort' parameter to define ascending(asc )/ descending(desc) 

  }*/
  return new Promise((resolve, reject) => {
    zomatoClient.search(qs, function (err, result) {
      if (!err) {
        var venuesResponse = JSON.parse(result);
        //console.log('venuesResponse ' + JSON.stringify(venuesResponse))
        resolve(venuesResponse)
      } else {
        reject(err)
      }
    })
  });
}

var hasVenues = (qs) => {
  return new Promise((resolve, reject) => {
    search(qs).then((json) => {
      if (json.results_found > 0) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}


var selectQsByPriority = (arrayQs) => {

  let arrayQueryMessages = arraySort(arrayQs, ['priority'], {
    reverse: false
  });

  let arraySelected = []
  let counter = 0
  console.log('arrayQueryMessages ' + JSON.stringify(arrayQueryMessages))
  return new Promise((resolve, reject) => {
    if (arrayQueryMessages.length > 0) {
      for (let i = 0; i < arrayQueryMessages.length; i++) {
        hasVenues(arrayQueryMessages[i]).then((tiene) => {
          if (tiene === true) {
            arraySelected.push(arrayQueryMessages[i])
          }

          if (counter === arrayQueryMessages.length - 1) {
            let arrayFinal = arraySort(arraySelected, ['priority'], {
              reverse: false
            });

            resolve(arrayFinal[0])
          }
          counter++
        })
      }

    } else {
      resolve(undefined)

    }


  })




}

var starRenderFBTemplate = (senderId, qs) => {
  preparateRenderFBTemplate(senderId, qs).then((eventResults) => {
    sendTemplatesFromArray(senderId, eventResults).then((eventResults) => {


      console.log('Resultados para la consulta qs: ' + JSON.stringify(qs));
      console.log(eventResults);
      console.log('Sender Id:' + senderId);

      Message.sendMessage(senderId, 'Check out these dine outs.');
      Message_2.genericTemplate(senderId, eventResults).then(() => {

        Message.typingOff(senderId);
        user_queries.createUpdateUserDatas(senderId, 'zomato_search', '', {}, '', '', '', 0, 0, '', '', '', '', '', '', '', '', '', 0, 0, qs)
      })


      //Message.genericButton(senderId, eventResults);

    })
  })
}

var preparateRenderFBTemplate = function (senderId, qs) {
  console.log('qs>>' + JSON.stringify(qs))
  return new Promise((resolve, reject) => {
    search(qs).then((json) => {

      if (json.results_found > 0) {
        console.log('Estos son los resultados:');
        console.log(json);
        Message.typingOn(senderId);

        let eventResults = [];
        let counter = 0;
        for (let i = 0; i < json.restaurants.length; i++) {
          let search = json.restaurants[i].restaurant.name + ' ' + json.restaurants[i].restaurant.location.locality + ' ' + json.restaurants[i].restaurant.location.city
          let gButtons = json.restaurants
          getGoogleImage(search, gButtons).then((images) => {
            eventResults.push({
              "title": json.restaurants[i].restaurant.name,
              //"image_url": json.restaurants[i].restaurant.thumb,
              "image_url": images[0].url,
              "subtitle": json.restaurants[i].restaurant.cuisines + ' ' + json.restaurants[i].restaurant.location.city,
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



            if (counter === json.restaurants.length - 1) {
              resolve(eventResults)
            }

            counter++;
          })


        }


      } else {
        console.log('zomato venues not found ')
      }




    }).catch((err) => {
      console.log('Error en la función getTemplateBySearch' + err)

    })
  })
}

var sendTemplatesFromArray = (senderId, eventResults) => {
  return new Promise((resolve, reject) => {
    if (eventResults.length == 9) {
      eventResults.push({
        "title": "Would you like to see more options?",
        "image_url": "https://ticketdelivery.herokuapp.com/images/ciudad.jpg",
        "subtitle": "My Pepper Bot",
        "default_action": {
          "type": "web_url",
          "url": "https://www.facebook.com/mypepperbot/"
          /*,
          "messenger_extensions": true,
          "webview_height_ratio": "tall",
          "fallback_url": baseURL + resultEvent[j].id + '&uid=' + senderId + '&venue_id=' + resultEvent[j].venue.id + '&performer_id=' + resultEvent[j].performances[0].performer.id + '&event_name=' + resultEvent[j].name*/
        },
        "buttons": [{
          "type": "postback",
          "title": "More venues",
          "payload": "zomato_see_more_venues"
        }]
      });
    }
    resolve(eventResults)
  })
}




var getGoogleImage = (search, matriz = []) => {
  return new Promise((resolve, reject) => {

    var gis = require('g-i-s');


    var opts = {
      searchTerm: search,
      //queryStringAddition: '&tbs=ic:trans',
      //filterOutDomains: [ ]
    };

    gis(opts, logResults);
    //gis(search, logResults);

    function logResults(error, results) {
      if (error) {
        reject(error);
      } else {
        resolve(results, matriz);
      }
    }

  });
}

var zomatoStartAI = (sender, contexts) => {
  Message.typingOn(sender);
  console.log('contexto ' + contexts[0].name)
  let beverage = ''
  let city = ''
  let country = ''
  let venue_type = ''
  let cuisine = ''
  let dish = ''
  let venue_title = ''
  let venue_chain = ''
  let venue_facility = ''
  let meal = ''


  if ((isDefined(contexts[0].parameters.meal))) {
    if (contexts[0].parameters.meal != "") {
      meal = contexts[0].parameters.meal
      console.log('meal>> ' + meal)
    }
  }



  if ((isDefined(contexts[0].parameters.venue_facility))) {
    if (contexts[0].parameters.venue_facility != "") {
      venue_facility = contexts[0].parameters.venue_facility
      console.log('venue_facility>> ' + venue_facility)
    }
  }


  if ((isDefined(contexts[0].parameters.venue_chain))) {
    if (contexts[0].parameters.venue_chain != "") {
      venue_chain = contexts[0].parameters.venue_chain
      console.log('venue_chain>> ' + venue_chain)
    }
  }



  if ((isDefined(contexts[0].parameters.venue_title))) {
    if (contexts[0].parameters.venue_title != "") {
      venue_title = contexts[0].parameters.venue_title
      console.log('venue_title>> ' + venue_title)
    }
  }


  if ((isDefined(contexts[0].parameters.dish))) {
    if (contexts[0].parameters.dish != "") {
      dish = contexts[0].parameters.dish
      console.log('dish>> ' + dish)
    }
  }


  if ((isDefined(contexts[0].parameters.beverage))) {
    if (contexts[0].parameters.beverage != "") {
      beverage = contexts[0].parameters.beverage
      console.log('beverage>> ' + beverage)
    }
  }

  if ((isDefined(contexts[0].parameters.venue_type))) {
    if (contexts[0].parameters.venue_type != "") {
      venue_type = contexts[0].parameters.venue_type
      console.log('venue_type>> ' + venue_type)
    }
  }


  if ((isDefined(contexts[0].parameters.location))) {
    if (isDefined(contexts[0].parameters.location.city)) {
      city = contexts[0].parameters.location.city
      console.log('city>> ' + city)

    } else {
      if (isDefined(contexts[0].parameters.location.country)) {
        country = contexts[0].parameters.location.country
        console.log('country>> ' + country)
        city = country
      }
    }

  }


  if ((isDefined(contexts[0].parameters.cuisine))) {
    if (contexts[0].parameters.cuisine != "") {
      cuisine = contexts[0].parameters.cuisine
      console.log('cuisineV >> ' + cuisine)
    }
  }


  if (venue_chain != '') {
    venue_title = venue_chain
  }

  if (dish != '') {
    venue_title = dish
  }

  if (beverage != '') {
    venue_title = beverage
  }




  if (venue_title != '') {
    evaluateIfUserSaysIsInTevo(sender, venue_title).then((continuar) => {
      if (continuar == true) {
        zomatoStartLater(sender, cuisine, venue_type, venue_title)
      }
    })
  }


  if (venue_title != '') {
    evaluateIfUserSaysIsInTevo(sender, venue_type).then((continuar) => {
      if (continuar == true) {
        zomatoStartLater(sender, cuisine, venue_type, venue_title)
      }  
    })
  }






}


var zomatoStartLater = (sender, cuisine = '', venue_type = '', venue_title = '') => {

  let qs = {}
  let zomatoQs = []
  if (city != '') {
    getCities(city).then((cityResponse) => {
      console.log('cityResponse' + JSON.stringify(cityResponse))
      let city_id = cityResponse.location_suggestions[0].id

      if (cuisine != '' && venue_type != '') {
        zomatoQs.push(searchByCityCuisineEstablishment(city_id, venue_type, cuisine, 1).then(qs))
      }

      if (venue_title != '' && venue_type != '') {
        zomatoQs.push(searchByCityVenueTitleEstablishment(city_id, venue_type, venue_title, 2).then(qs))
      }

      if (venue_title != '' && cuisine != '') {
        zomatoQs.push(searchByCityVenueTitleCusine(city_id, venue_title, cuisine, 3).then(qs))
      }

      if (venue_type != '') {
        zomatoQs.push(searchByCityEstablishment(city_id, venue_type, 4).then(qs))
      }

      if (cuisine != '') {
        zomatoQs.push(searchByCityCuisine(city_id, cuisine, 5).then(qs))
      }

      if (venue_title != '') {
        zomatoQs.push(searchByCityVenueTitle(city_id, venue_title, 6).then(qs))

      }
      zomatoQs.push(searchByCity(city_id, 7).then(qs))


      Promise.all(zomatoQs).then(ArrayQs => {
        console.log('zomatoQs ' + JSON.stringify(ArrayQs))
        selectQsByPriority(ArrayQs).then((qs) => {
          if (isDefined(qs)) {
            console.log('priority ' + qs.priority)
            delete qs.priority;

            starRenderFBTemplate(sender, qs)
          } else {
            console.log('qs de zomato está indefinida ')

            defaultTevoSearch(sender)

          }


        })

      });



    })

  } else { //busquedas por cordenadas...
    console.log('Se activa busqueda por coordenadas...')
    user_queries.getUserByFbId(sender).then((foundUser) => {
      if (isDefined(foundUser)) {
        let lat = foundUser.location.coordinates[0];
        let lon = foundUser.location.coordinates[1];
        if (isDefined(lat) && isDefined(lon)) {

          if (cuisine != '' && venue_type != '') {
            zomatoQs.push(searchByCuisineEstablishmentAndCoordinates(lat, lon, cuisine, venue_type, 1).then(qs))
          }

          if (venue_title != '' && venue_type != '') {
            zomatoQs.push(searchByVenueTitleEstablishmentAndCoordinates(lat, lon, venue_type, venue_title, 2).then(qs))
          }

          if (venue_title != '' && cuisine != '') {
            zomatoQs.push(searchByVenueTitleCusineAndCoordinates(lat, lon, venue_title, cuisine, 3).then(qs))
          }

          if (venue_type != '') {
            zomatoQs.push(searchByEstablismentAndCoordinates(lat, lon, venue_type, 4).then(qs))
          }

          if (cuisine != '') {
            zomatoQs.push(searchByCuisineAndCoordinates(cuisine, lat, lon, 5).then(qs))
          }

          if (venue_title != '') {
            zomatoQs.push(searchByVenueTitleAndCoordinates(venue_title, lat, lon, 6).then(qs))
          }


          zomatoQs.push(searchByCoordinates(lat, lon, 7).then(qs))





          Promise.all(zomatoQs).then(ArrayQs => {
            console.log('zomatoQs ' + JSON.stringify(ArrayQs))
            selectQsByPriority(ArrayQs).then((qs) => {
              if (isDefined(qs)) {
                console.log('priority ' + qs.priority)
                delete qs.priority;

                starRenderFBTemplate(sender, qs)
              } else {
                console.log('qs de zomato está indefinida ' + qs.priority)
                defaultTevoSearch(sender)

              }

            })

          });

        } else { //pedir coordenadas....
          user_queries.createUpdateUserDatas(sender, 'find_venue_to_eat').then(() => {
            Message.getLocation(sender, 'What location would you like to eat at?');
          })

        }
      }
    })
  }



}



var evaluateIfUserSaysIsInTevo = (sender, event_title) => {
  return new Promise((resolve, reject) => {
    startTevoByName(sender, event_title).then((cantidad1) => {


      console.log('cantidad 1 ' + cantidad1)
      if (cantidad1 == 0) {
        defaultTevoSearch(sender).then((cantidad2) => {

          console.log('cantidad 2 ' + cantidad2)


          if (cantidad2 == 0) {
            console.log('No Resolví en Tevo !! defaultTevoSearch  cantidad 2 == 0')
            resolve(true)

          } else {
            console.log('Resolví en Tevo !! defaultTevoSearch cantidad 2 != 0')
            resolve(false)
          }
        })
      } else {
        resolve(true)




      }
    })
  })
}

var startTevoByName = (senderId, event_title) => {
  return new Promise((resolve, reject) => {
    if (event_title != '') {
      console.log('Esta Busqueda que debe ser corregida en diccionario de Dialog Flow!' + event_title)
      let userPreferences = {
        event_title: '',
        city: '',
        artist: '',
        team: '',
        event_type: '',
        music_genre: ''
      }

      let page = 1
      let per_page = 9

      var query = {
        prioridad: 4,
        searchBy: 'ByName',
        query: tevo.API_URL + 'events?q=' + event_title + '&page=' + page + '&per_page=' + per_page + '&' + only_with + '&order_by=events.occurs_at',
        queryReplace: tevo.API_URL + 'events?q=' + event_title + '&page=' + '{{page}}' + '&per_page=' + '{{per_page}}' + '&' + only_with + '&order_by=events.occurs_at',
        queryPage: page,
        queryPerPage: per_page,
        messageTitle: 'Cool, I looked for "' + event_title + '" shows.  Book a ticket'
      }

      tevoClient.getJSON(query.query).then((json) => {
        let salir = false;
        if (json.error) {
          console.log('Error al ejecutar la tevo query ' + query.query + 'err.message: ' + json.error);
          resolve(0)
        } else {
          if (json.events.length > 0) {
            TevoModule.start(senderId, query.query, 0, query.messageTitle, {}, query);
            resolve(json.events.length)
            //user_queries.createUpdateUserDatas(senderId, '', '', {}, '', query.query, query.queryReplace, query.queryPage, query.queryPerPage, userPreferences.artist, userPreferences.music_genre, userPreferences.team, userPreferences.city, query.messageTitle, userPreferences.event_type)
          } else {
            console.log('No encontré nada con  ' + event_title);
            resolve(0)
          }
        }
      }).catch((error) => {
        console.log('error en la consulta enviada a tevo')
        resolve(0)
      })
    } else {
      resolve(0)
    }

  })

}



function find_my_event(senderId, hi = 0, event_name = '') {
  UserData.getInfo(senderId, function (err, result) {
    if (!err) {

      var bodyObj = JSON.parse(result);
      console.log(result);


      var User = new UserData2; {
        User.fbId = senderId;
        User.firstName = bodyObj.first_name;
        User.LastName = bodyObj.last_name;
        User.profilePic = bodyObj.profile_pic;
        User.locale = bodyObj.locale;
        User.timeZone = bodyObj.timezone;
        User.gender = bodyObj.gender;
        User.messageNumber = 1;

        User.save();
      }

      var name = bodyObj.first_name;

      var greeting = "Hi " + name;
      var messagetxt = greeting + ", you can search events by:";
      if (hi == 1) {
        messagetxt = 'I didn’t find any of that. ' + name + ", you can search events by:";
        greeting = name;
      }



      //var ButtonsEventsQuery = require('../modules/tevo/buttons_event_query');
      //var ButtonsEventsQuery = require('../modules/tevo/buttons_choise_again');
      //ButtonsEventsQuery.send(Message, senderId, messagetxt);

      var SearchQuickReply = require('../modules/tevo/search_init_quick_replay');
      SearchQuickReply.send(Message, senderId, messagetxt);

      UserData2.findOne({
        fbId: senderId
      }, {}, {
        sort: {
          'sessionStart': -1
        }
      }, function (err, foundUser) {
        foundUser.context = ''
        foundUser.save();
      });


    }
  });
};



var defaultTevoSearch = (sender) => {
  return new Promise((resolve, reject) => {
    var page = 1;
    var per_page = 9;


    var arrayQueryMessages = []
    var userPreferences = {
      event_title: '',
      city: '',
      artist: '',
      team: '',
      event_type: '',
      music_genre: ''
    }
    UserData2.findOne({
      fbId: sender
    }, {}, {
      sort: {
        'sessionEnd': -1
      }
    }, function (err, foundUser) {
      if (foundUser) {
        let userSays = foundUser.userSays[foundUser.userSays.length - 1]
        if (userSays) {
          if (userSays.typed) {

            var query = {
              prioridad: 4,
              searchBy: 'ByName',
              query: tevo.API_URL + 'events?q=' + userSays.typed + '&page=' + page + '&per_page=' + per_page + '&' + only_with + '&order_by=events.occurs_at',
              queryReplace: tevo.API_URL + 'events?q=' + userSays.typed + '&page=' + '{{page}}' + '&per_page=' + '{{per_page}}' + '&' + only_with + '&order_by=events.occurs_at',
              queryPage: page,
              queryPerPage: per_page,
              messageTitle: 'Cool, I looked for "' + userSays.typed + '" shows.  Book a ticket'
            }


            tevoClient.getJSON(query.query).then((json) => {
              if (json.error) {
                //console.log('Error al ejecutar la tevo query ' + arrayQueryMessages[i].query + 'err.message: ' + json.error);
                resolve(0)
              } else {
                if (json.events.length > 0) {
                  console.log("query Tevo >>> " + JSON.stringify(query));
                  TevoModule.start(sender, query.query, 1, query.messageTitle, userPreferences, query);
                  resolve(json.events.length)
                } else {

                  console.log('definitivamente no encontré nada!!')

                  resolve(0)
                }

              }
            }).catch((error) => {
              console.log('Error en la consulta!')
              resolve(0)

            })
          } else {
            console.log('no tengo guardado lo ultimo que escribió el usuario')
            resolve(0)
          }
        }

      } else {
        console.log('user no found !!!! consultado by fbId en  ')
        resolve(0)
      }
    })
  })

}

function isDefined(obj) {
  if (typeof obj == 'undefined') {
    return false;
  }

  if (!obj) {
    return false;
  }

  return obj != null;
}




module.exports = {
  getCities,
  getCityQs,
  getCityEstablishmentQs,
  searchByCityEstablishment,
  getCityCuisineQs,
  searchByCityCuisine,
  getCityVenueTitleQs,

  searchByCuisineAndCoordinates,
  searchByEstablismentAndCoordinates,
  searchByVenueTitleAndCoordinates,
  searchByCityCuisineEstablishment,
  searchByCityVenueTitle,
  searchByCityVenueTitleEstablishment,
  searchByCityVenueTitleCusine,
  selectQsByPriority,
  searchByCuisineEstablishmentAndCoordinates,
  starRenderFBTemplate,
  searchByCity,
  searchByCoordinates,
  searchByVenueTitleEstablishmentAndCoordinates,
  searchByVenueTitleCusineAndCoordinates,
  hasVenues,

  zomatoStartAI


}