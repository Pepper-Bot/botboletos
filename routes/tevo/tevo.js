const tevoRoutes = require("express").Router();
var gis = require("../../util/gis");
var google_images = require("../../util/google.images");
var artistQueries = require("../../db/queries/artist.queries");

var tevo = require("../../config/config_vars").tevo; 

var TevoClient = require("ticketevolution-node");
var geoip = require("geoip-lite");

var tevoClient = new TevoClient({
  apiToken: tevo.API_TOKEN,
  apiSecretKey: tevo.API_SECRET_KEY
});



/**
 * @description Ruta con prefijo
 * tevo ejemplo:
 * http://localhost:8888/tevo/performers/query/category_id=54&category_tree=true&only_with_upcoming_events=true&order_by=performers.popularity_score%20DESC&page=1&per_page=12
 *  //"https://appleo.herokuapp.com/tevo/performers/query/category_id=54&category_tree=true&only_with_upcoming_events=true&order_by=performers.popularity_score%20DESC&page=1&per_page=12"
 *
 */
tevoRoutes.route("/performers/query/:query").get(function(req, res) {
  var query = req.params.query;
  let urlApiTevo = `${tevo.API_URL}performers?${query}`;
  //console.log("url tevo" + urlApiTevo);
  if (tevoClient) {
    tevoClient
      .getJSON(urlApiTevo)
      .then(json => {
        res.status(200).send(json);
        /*let performers = json.performers;
        let counter = 0;
        for (let i = 0; i < performers.length; i++) {
          gis.getGoogleImage(performers[i].name, performers).then(images => {
            if (images.length > 0) {
              performers[i].imageUrl = images[0].url;
            } else {
              performers[i].imageUrl = "No Image";
            }
            counter++;
            console.log(counter + "\n");
            if (counter === performers.length - 1) {
              res.status(200).send(performers);
            }
          });
        }*/
      })
      .catch(err => {
        res.status(300).send(err);
      });
  }
});

tevoRoutes.route("/performers-update/:size").get(function(req, res) {
  let size = req.params.size;

  let urlApiTevo =
  `${tevo.API_URL}performers?category_id=54&category_tree=true&only_with_upcoming_events=true&order_by=performers.popularity_score%20DESC&page=1&per_page=12`
  //console.log("url tevo" + urlApiTevo);
  if (tevoClient) {
    tevoClient
      .getJSON(urlApiTevo)
      .then(json => {
        let performers = json.performers;
        let counter = 0;
        for (let i = 0; i < performers.length; i++) {
          gis
            .getGoogleImage(performers[i].name + size, performers)
            .then(images => {
              if (images.length > 0) {
                performers[i].imageUrl = images[0].url;
              } else {
                performers[i].imageUrl = "No Image";
              }

              let imageToSave = {
                size: size,
                url: performers[i].imageUrl
              };

              artistQueries
                .newArtists(
                  performers[i].id,
                  performers[i].name,
                  performers[i].popularity_score,
                  imageToSave,
                  performers[i].category.id,
                  performers[i].category.name
                )
                .then(() => {
                  counter++;
                  console.log(counter + "\n");
                  if (counter === performers.length - 1) {
                    res.status(200).send(performers);
                  }
                });
            });
        }
      })
      .catch(err => {
        res.status(300).send(err);
      });
  }
});

//http://localhost:8888/tevo/performers-update/size/300X300/page/2

tevoRoutes
  .route("/performers-update/size/:size/page/:page")
  .get(function(req, res) {
    let size = req.params.size;
    let page = req.params.page;

    

    let urlApiTevo = `https://api.ticketevolution.com/v9/performers?category_id=54&category_tree=true&only_with_upcoming_events=true&order_by=performers.popularity_score%20DESC&page=${page}&per_page=100`;
    //console.log("url tevo" + urlApiTevo);
    if (tevoClient) {
      tevoClient
        .getJSON(urlApiTevo)
        .then(json => {
          let performers = json.performers;
          let counter = 0;
          for (let i = 0; i < performers.length; i++) {
            gis
              .getGoogleImage(performers[i].name + size, performers)
              .then(images => {
                if (images.length > 0) {
                  performers[i].imageUrl = images[0].url;
                } else {
                  performers[i].imageUrl = "No Image";
                }

                let imageToSave = {
                  size: size,
                  url: performers[i].imageUrl
                };

                artistQueries
                  .newArtists(
                    performers[i].id,
                    performers[i].name,
                    performers[i].popularity_score,
                    imageToSave,
                    performers[i].category.id,
                    performers[i].category.name
                  )
                  .then(() => {
                    counter++;
                    console.log(counter + "\n");
                    if (counter === performers.length - 1) {
                       res.status(200).send(performers);
                    }
                  });
              });
          }
        })
        .catch(err => {
          res.status(300).send(err);
        });
    }
  });

module.exports = tevoRoutes;
