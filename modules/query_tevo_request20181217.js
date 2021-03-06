var Message = require("../bot/messages");
var imageCards = require("../modules/imageCards"); // Google images
var TevoClient = require("ticketevolution-node");
var moment = require("moment");
var UserData = require("../bot/userinfo");
var UserData2 = require("../schemas/userinfo");
var tevo = require("../config/config_vars").tevo;
var APLICATION_URL_DOMAIN = require("../config/config_vars")
  .APLICATION_URL_DOMAIN;


let configVars = require("../config/config_vars")
let APPLICATION_URL_EXTENSION = configVars.APPLICATION_URL_EXTENSION

var google = require("../config/config_vars").google;

var only_with = require("../config/config_vars").only_with;
var user_queries = require("../schemas/queries/user_queries");
var eventsQueries = require("../schemas/queries/events.queries");
module.exports = (function () {
  return {
    start: function (
      senderId,
      urlApiTevo,
      position = 0,
      messageTitle = "",
      userPreferences = {},
      query = {},
      track_artist = false,
      action
    ) {
      var tevoClient = new TevoClient({
        apiToken: tevo.API_TOKEN,
        apiSecretKey: tevo.API_SECRET_KEY
      });

      console.log("url api tevo>>>>>>>" + urlApiTevo);
      console.log("query Tevo Complete >" + JSON.stringify(query));
      console.log("user Preferences >" + JSON.stringify(userPreferences));

      var event_id = 0;
      if (tevoClient) {
        tevoClient
          .getJSON(urlApiTevo)
          .then(json => {
            if (json.error) {
              Message.sendMessage(senderId, json.error);
            } else {
              if (json.events.length > 0) {
                Message.markSeen(senderId);
                Message.typingOn(senderId);

                console.log(
                  "TENEMOS  " +
                  json.events.length +
                  " EVENTOS <<<<<<<<<<<POSITION > " +
                  position
                );
                var resultEvent = [];
                resultEvent = json.events;
                var eventButtons_ = [];
                var callsGis = 0;
                var baseURL = APPLICATION_URL_EXTENSION //APLICATION_URL_DOMAIN + "event/?event_id=";

                if (resultEvent.length > 9 * (position - 1)) {
                  if (position * 9 > resultEvent.length - 9) {
                    position = 0;
                    UserData2.findOne({
                        fbId: senderId
                      }, {}, {
                        sort: {
                          sessionStart: -1
                        }
                      },
                      function (err, foundUser) {
                        if (!err) {
                          if (null != foundUser) {
                            foundUser.showMemore.index1 = 0;
                            foundUser.save(function (err) {
                              if (!err) {
                                console.log("index1 en cero");
                              } else {
                                console.log("error al actualizar el index 0");
                              }
                            });
                          }
                        }
                      }
                    );
                  }

                  console.log("position: " + position);
                  if (9 * (position + 1) < resultEvent.length + 1)
                    resultEvent.splice(
                      9 * (position + 1),
                      resultEvent.length - 9 * (position + 1)
                    );
                  if (position - 1 >= 0)
                    if (9 * position < resultEvent.length + 1)
                      resultEvent.splice(0, 9 * position);
                }
                //}

                console.log(
                  "TENEMOS  " +
                  resultEvent.length +
                  " EVENTOS LUEGO DE RECORTARLOS    <<<<<<<<<<<<<<<<<<<<<<<<<<"
                );

                for (var j = 0, c = resultEvent.length; j < c; j++) {
                  console.log(
                    "EVENTO " +
                    j +
                    "--" +
                    resultEvent[j].id +
                    ">>>>>>>>>>>>>>>>"
                  );

                  var occurs_at = resultEvent[j].occurs_at;
                  occurs_at = occurs_at.substring(0, occurs_at.length - 4);

                  //var occurs_at = moment(occurs_at).format('dddd') + ', ' + moment(occurs_at).format('MMMM Do YYYY, h:mm a')

                  var occurs_at = moment(occurs_at).format(
                    "MMM Do YYYY, h:mm a"
                  );


                  let urlWeb = `${baseURL}${resultEvent[j].id}&uid=${senderId}&venue_id=${resultEvent[j].venue.id}&performer_id=${resultEvent[j].performances[0].performer.id}&event_name=${resultEvent[j].name}`

                  urlWeb = `${baseURL}/book/${resultEvent[j].performances[0].performer.name}?senderId=${senderId}`

                  console.log(`urlWeb ${urlWeb}`)

                  eventButtons_.push({
                    title: resultEvent[j].name, // +' '+ resultEvent[j].category.name,
                    performer: resultEvent[j].performances[0].performer.name,
                    id: resultEvent[j].id,
                    image_url: resultEvent[j].category.name,
                    subtitle: `${resultEvent[j].venue.name} ${resultEvent[j].venue.location} ${occurs_at}`,
                    default_action: {
                      type: "web_url",
                      url: urlWeb,
                      //"messenger_extensions": true,
                      webview_height_ratio: "full"
                      //"fallback_url": baseURL + resultEvent[j].id + '&uid=' + senderId + '&venue_id=' + resultEvent[j].venue.id + '&performer_id=' + resultEvent[j].performances[0].performer.id + '&event_name=' + resultEvent[j].name
                    },
                    buttons: [{
                        type: "web_url",
                        //"messenger_extensions": true,
                        webview_height_ratio: "full",
                        url: urlWeb,
                        title: "Book"
                      },
                      {
                        type: "element_share"
                      }
                    ]
                  });
                }
                if (eventButtons_.length == 9)
                  eventButtons_.push({
                    title: "Can’t make any of these times?",
                    subtitle: "My Pepper Bot",
                    default_action: {
                      type: "web_url",
                      url: "https://www.facebook.com/mypepperbot/"
                      /*,
                                        "messenger_extensions": true,
                                        "webview_height_ratio": "tall",
                                        "fallback_url": baseURL + resultEvent[j].id + '&uid=' + senderId + '&venue_id=' + resultEvent[j].venue.id + '&performer_id=' + resultEvent[j].performances[0].performer.id + '&event_name=' + resultEvent[j].name*/
                    },
                    buttons: [{
                      type: "postback",
                      title: "More event times",
                      payload: "find_my_event_see_more_events_by_query"
                    }]
                  });

                var gButtons = eventButtons_;
                var counter = 0;

                setImagesToEvents(gButtons, counter).then(gButtons => {
                  Message.sendMessage(senderId, messageTitle, "events.search.card");

                  console.log(
                    "luego del GButons event_name >>>>> " + urlApiTevo
                  );

                  var GenericButton = require("../bot/generic_buttton");
                  GenericButton.genericButtonQuickReplay(
                    senderId,
                    gButtons,
                    "Find something else? ",
                    track_artist

                  ).then(() => {
                    // createUpdateUserDatas = (senderId, context '', mlinkSelected = '', userSays = {}, eventSearchSelected = '', querysTevo = '', queryTevoFinal = '', page = 0, per_page = 0, artists = '', musical_genres = '', teams = '', cities = '', categorySearchSelected = '', optionsSelected = '', index1 = 0, index2 = 0, index3 = 0


                    user_queries.createUpdateUserDatas(
                      senderId,
                      "",
                      "", {},
                      "",
                      urlApiTevo,
                      query.queryReplace,
                      query.queryPage,
                      query.queryPerPage,
                      userPreferences.artist,
                      userPreferences.music_genre,
                      userPreferences.team,
                      userPreferences.city,
                      query.messageTitle,
                      userPreferences.event_type
                    );

                    Message.typingOff(senderId);
                  });
                });
              } else {
                Message.sendMessage(senderId, "No Found Events");
              }
            } //fin  de else json.error
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  };
})();

var setImagesToEvents = (resultEvents, counter) => {
  // var gButtons = [];
  var gButtons = resultEvents;

  for (i = 0; i < gButtons.length; i++) {
    if (gButtons[i].id == 1104020) {
      gButtons.splice(i, 1);
    }

  }

  return new Promise((resolve, reject) => {
    for (let z = 0; z < gButtons.length; z++) {
      let search = gButtons[z].title;
      console.log("search " + search);

      var cadena = search,
        separador = " ", // un espacio en blanco
        arregloDeSubCadenas = cadena.split(separador);

      console.log(arregloDeSubCadenas); // la consola devolverá: ["cadena", "de", "texto"]

      for (let k = 0; k < arregloDeSubCadenas.length; k++) {
        if (arregloDeSubCadenas[k] == "(Rescheduled") {
          search = gButtons[z].performer;
          gButtons[z].title = search;
        }
      }


      let shark_tank = false

      if (gButtons[z].performer == "Live Sharks Tank") {
        shark_tank = true
      }




      delete gButtons[z].performer;

      var results = [];
      var images = [];
      //getGoogleImagesSelected(search, gButtons, results, images).then((images) => {
      getGoogleImage(search, gButtons)
        .then(images => {
          console.log("images.length " + images.length);

          var imageIndex = 0;
          if (images.length > 0) {
            if (images.length > 4) {
              imageIndex = Math.round(Math.random() * 3);
            } else {
              imageIndex = Math.round(Math.random() * images.length - 1);
            }

            console.log(
              "imageIndex " + imageIndex + " images.length " + images.length
            );
            gButtons[z].image_url = images[imageIndex].url;

            let imagenGis = {
              kind: "messenger",
              url: gButtons[z].image_url
            };
            eventsQueries.newEvent(search, search, imagenGis);

            /* 
                eventsQueries
                .getEvent(search)
                .then(eventFound => {
                  console.log("images.length " + images.length);
    
                  if (eventFound.images[0].url) {
                    console.log("encontré imagen en la bd!!");
                    gButtons[z].image_url = eventFound.images[0].url;
                  }
                })*/
            if (search == "Chelsea Blues at FC Barcelona") {
              gButtons[z].image_url =
                "https://www.nigerianews360.com/wp-content/uploads/2018/02/chelsea-vs-barcelona-at-uefa-champions-league-who-will-succeed.png";
            }
            if (search == "Athletic Bilbao at FC Barcelona") {
              gButtons[z].image_url =
                "https://cdn.vox-cdn.com/thumbor/OFbCx66r30gwhimbKSqaAFnJz90=/0x15:3000x2015/1200x800/filters:focal(0x15:3000x2015)/cdn.vox-cdn.com/uploads/chorus_image/image/48578013/GettyImages-485084850.0.jpg";
            }
            if (search == "CD Leganes at FC Barcelona") {
              gButtons[z].image_url =
                "https://www.highfive.com.tr/assets/img/event/b/fc-barcelona-cd-leganes.jpg";
            }
            if (search == "Valencia CF at FC Barcelona") {
              gButtons[z].image_url =
                "https://cdn.vox-cdn.com/thumbor/uKXeHyddTi9FQKfF4ZCdAuVkerk=/0x0:3000x2002/1200x800/filters:focal(1220x462:1700x942)/cdn.vox-cdn.com/uploads/chorus_image/image/58385515/655316424.jpg.0.jpg";
            }
            if (search == "Copa Del Rey - Sevilla FC at FC Barcelona") {
              gButtons[z].image_url =
                "https://media-public.fcbarcelona.com/20157/0/document_thumbnail/20197/127/140/110/57576575/1.0-10/57576575.jpg?t=1508237543000";
            }

            if (search == "Real Madrid CF at FC Barcelona") {
              gButtons[z].image_url =
                "https://i.eurosport.com/2017/04/21/2067464-43344487-2560-1440.jpg?w=700";
            }

            if (search == "Villarreal CF at FC Barcelona") {
              gButtons[z].image_url =
                "https://i2.wp.com/i.gyazo.com/aaeeaa13da8d19997161bada47e00f8b.png?resize=760%2C508&ssl=1";
            }
            //
            if (search == "Real Sociedad at FC Barcelona") {
              gButtons[z].image_url =
                "https://statics.sportskeeda.com/wp-content/uploads/2016/11/626150036-lionel-messi-of-fc-barcelona-duels-for-the-gettyimages-1480309071-800.jpg";
            }


          } else {
            console.log(
              "Error con el tamaño de Images.   images.length " +
              images.length +
              " buscando  " +
              search
            );
            gButtons[z].image_url =
              APLICATION_URL_DOMAIN + "/images/no_found.png";
          }


          if (shark_tank === true) {
            gButtons[z].image_url =
              "https://ticketdelivery.herokuapp.com/images/sharkstank/sharks_anniversary_web.png";
          }





          if (gButtons[z].id === 1104021) {
            gButtons[z].title = "FIFA World Cup Soccer Finals Francia Vs Croatia"
            gButtons[z].image_url = "https://ticketdelivery.herokuapp.com/images/fifa_worl_cup/francia_croatia.jpg"
          } else if (gButtons[z].id === 1104026) {
            gButtons[z].title = "FIFA World Cup Soccer Third Place Belgica Vs Inglaterra"
            gButtons[z].image_url = "https://ticketdelivery.herokuapp.com/images/fifa_worl_cup/belgica_inglaterra.jpg"

          }


          delete gButtons[z].id;



          if (gButtons[z].subtitle == "My Pepper Bot") {
            gButtons[z].image_url =
              "https://ticketdelivery.herokuapp.com/images/ciudad.jpg";
          }

          console.log(
            "counter " + counter + " gButtons.length " + gButtons.length
          );

          if (counter + 1 == gButtons.length) {
            if (gButtons[z].subtitle == "My Pepper Bot")
              gButtons[gButtons.length - 1].image_url =
              "https://ticketdelivery.herokuapp.com/images/ciudad.jpg";
            resolve(gButtons);
          }
        })
        .then(() => {
          counter = counter + 1;
        });
    }
  });

  /// Promise.all(gButtons).then(a => console.log("Eventos >" + JSON.stringify(a)));
};

var getGoogleImage = (search, matriz = []) => {
  return new Promise((resolve, reject) => {
    var gis = require("g-i-s");
    gis(search, logResults);

    function logResults(error, results) {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    }

    /*    const GoogleImages = require('google-images');

        const client = new GoogleImages(google.GOOGLE_CSE_ID, google.GOOGLE_API_KEY);

        client.search(search)
            .then(images => {
             
                [{
                    "url": "http://steveangello.com/boss.jpg",
                    "type": "image/jpeg",
                    "width": 1024,
                    "height": 768,
                    "size": 102451,
                    "thumbnail": {
                        "url": "http://steveangello.com/thumbnail.jpg",
                        "width": 512,
                        "height": 512
                    }
                }] 
                
                console.log('imagenes ' + JSON.stringify(images))
                resolve(images)
            }); */
  });
};

var getGoogleImagesSelected = (search, matriz = [], results, results1) => {
  return new Promise((resolve, reject) => {
    getGoogleImage(search, matriz).then(results => {
      selectImages(results, results1).then(results1 => {
        resolve(results1);
      });
    });
  });
};

var selectImages = (results, results1 = []) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < results.length; i++) {
      if (
        results[i].width / results[i].height >= 1.91 &&
        results[i].width / results[i].height <= 2 &&
        results[i].height > 300
      ) {
        results1.push(results[i]);

        if (results1.length == 4) {
          resolve(results1);
        }
      }
    }
  });
};

var getGoogleImage2 = search => {
  return new Promise((resolve, reject) => {
    var gis = require("g-i-s");

    var opts = {
      searchTerm: search,
      queryStringAddition: "&tbs=ic:trans",
      filterOutDomains: ["pinterest.com", "deviantart.com"]
    };

    var opts = {
      searchTerm: search
    };

    gis(opts, logResults);

    var contador = 0;

    function logResults(error, results) {
      if (error) {
        reject(error);
      } else {
        resolve(results);

        //console.log("Imagenes gis Respuesta >>> " + results.length);
        //console.log("Imagenes gis Respuesta >>> " + JSON.stringify(results));
        //resolve(results, matriz);
        /* var results1 = [];
                 for (let i = 0; i < results.length; i++) {

                     if (results[i].width / results[i].height >= 1.91 && results[i].width / results[i].height <= 2 && results[i].height > 300) {

                         results1.push(results[i])
                         contador++;
                         if (contador == 4) {
                             resolve(results1);
                         }


                     }

                     let index = results.length - 1 - i;

                    /* if (results[index]) {
                         if (results[index].width / results[index].height >= 1.91 && results[index].width / results[index].height <= 2 && results[index].height > 300) {

                             results1.push(results[index])
                             contador++;
                             if (contador == 4) {
                                 resolve(results1);
                             }


                         }
                     } else {
                         console.log("Error index > " + index);

                     } 


                     if (results.length - 1 <= 0)
                         if (i + 1 == results.length) {
                             resolve(results);
                         }


                 }*/
      }
    }
  });
};

function inspeccionar(obj) {
  var msg = "";

  for (var property in obj) {
    if (typeof obj[property] == "function") {
      var inicio = obj[property].toString().indexOf("function");
      var fin = obj[property].toString().indexOf(")") + 1;
      var propertyValue = obj[property].toString().substring(inicio, fin);
      msg +=
        typeof obj[property] + " " + property + " : " + propertyValue + " ;\n";
    } else if (typeof obj[property] == "unknown") {
      msg += "unknown " + property + " : unknown ;\n";
    } else {
      msg +=
        typeof obj[property] + " " + property + " : " + obj[property] + " ;\n";
    }
  }
  return msg;
}

function inspeccionar2(obj) {
  var msg = new Array();

  for (var property in obj) {
    if (typeof obj[property] == "function") {
      var inicio = obj[property].toString().indexOf("function");
      var fin = obj[property].toString().indexOf(")") + 1;
      var propertyValue = obj[property].toString().substring(inicio, fin);
      msg[msg.length] = {
        type: typeof obj[property],
        name: property,
        value: propertyValue
      };
    } else if (typeof obj[property] == "unknown") {
      msg[msg.length] = {
        type: "unknown",
        name: property,
        value: "unknown"
      };
    } else {
      msg[msg.length] = {
        type: typeof obj[property],
        name: property,
        value: obj[property]
      };
    }
  }
  return msg;
}