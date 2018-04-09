var tevoClient = require("./index").tevoClient;
var tevo = require("./index").tevo;
var gis = require("../../util/gis");
var getCleanedString = require("../../util/fun_varias").getCleanedString;

var artistQueries = require("./index").artistQueries;

const urlApiTevo = `${tevo.API_URL}performers`;

var searchPerformersByQuery = query => {
  let urlApiTevoQ = `${urlApiTevo}?${query}`;
  return new Promise((resolve, reject) => {
    if (tevoClient) {
      tevoClient.getJSON(urlApiTevoQ).then(json => {});
    }
  });
};

var searchPerformersByNames = (names = []) => {
  return new Promise((resolve, reject) => {
    let newPerformers = [];
    let counter = 0;
    for (let i = 0; i < names.length; i++) {
      let name = names[i];
      searchPerformersByName(names[i]).then(performers => {
        if (performers.length > 0) {
          let performer = {
            performer_id: performers[0].id,
            name: performers[0].name,
            images: [],
            popularity_score: performers[0].popularity_score,

            category_id: performers[0].category.id,
            category_name: performers[0].category.name
          };

          newPerformers.push(performer);

          /*gis
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
          })*/

          artistQueries
            .newArtists(
              performers[0].id,
              performers[0].name,
              performers[0].popularity_score,
              {},
              performers[0].category.id,
              performers[0].category.name
            )
            .then(() => {
              counter++;
              console.log(counter + "\n");
              if (counter === names.length - 1) {
                resolve(newPerformers);
              }
            });
        } else {
          counter++;
          console.log(counter + "\n");
          if (counter === names.length - 1) {
            resolve(newPerformers);
          }
        }
      });
    }
  });
};

var searchPerformersByName = name => {
  let urlApiTevoQ = `${urlApiTevo}?name=${name}`;
  return new Promise((resolve, reject) => {
    if (tevoClient) {
      tevoClient
        .getJSON(urlApiTevoQ)
        .then(json => {
          console.log(json.performers);
          resolve(json.performers);
        })
        .catch(error => {
          console.log("Error al consultar a tevo en searchPerformersByName");
          resolve([]);
        });
    }
  });
};





var setPerformerId = artists => {
  return new Promise((resolve, reject) => {
    let counter = 0;
    let newArtists = artists;
 console.log(`setPerformerId newArtists newArtists.length ${newArtists.length}`)   
    for (let i = 0; i < newArtists.length; i++) {
      console.log(`artistsRecentlyPlayed.name ${newArtists[i].name}`);
      //let name = getCleanedString(newArtists[i].name);

      let name = newArtists[i].name

      console.log(`setPerformerId name ${name}`);

      searchPerformersByName(name)
        .then(performers => {
          console.log(`setPerformerId counter ${counter}`);

          if (performers.length > 0) {
            artistQueries
              .newArtistWithImages(
                performers[0].id,
                performers[0].name,
                performers[0].popularity_score,
                newArtists[i].images,
                performers[0].category.id,
                performers[0].category.name
              )
              .then(() => {
                counter++;
                newArtists[i].performer_id = performers[0].id;

                if (counter === newArtists.length - 1) {
                  console.log('salí ok 1')
                  resolve(newArtists);
                }
              })
              .catch(error => {
                counter++;
                if (counter === newArtists.length - 1) {
                  console.log('salí ok 2')
                  resolve(newArtists);
                }
              });
          } else {
            counter++;
            if (counter === newArtists.length - 1) {
              console.log('salí ok 3')
              resolve(newArtists);
            }
          }
        })
        .catch(error => {
          counter++;
          if (counter === newArtists.length - 1) {
            resolve(newArtists);
          }
        });
    }
  });
};

module.exports = {
  searchPerformersByQuery,
  searchPerformersByNames,
  searchPerformersByName,
  setPerformerId
};
