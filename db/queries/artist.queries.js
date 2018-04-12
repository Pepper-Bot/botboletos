var ArtistSchema = require("../schemas/artist.schema");
var isDefined = require("../../util/fun_varias").isDefined;


var getArtists = (limite, n = 1) => {
  console.log("" + limite);
  limite = Number(limite);

  return new Promise((resolve, reject) => {
    ArtistSchema.find({ category_id: { $nin: [56, 55, 70] } })
      .sort({ popularity_score: -1 })
      .skip(limite * (n - 1))
      .limit(limite)
      .exec(function(err, artists) {
        if (err) {
          console.log("error en getArtists " + err);
          resolve([]);
        }
        if (!artists) {
          resolve([]);
        }
        if (artists) {
          resolve(artists);
        }
      });
  });
};
/**
 * 
 * @param {*} name 
 * @param {*} limite 
 * @param {*} n 
 */
var searchArtistsLikeName = (name, limite = 24, n = 1) => {
  console.log("" + limite);
  limite = Number(limite);
  console.log(`name ${name}`);
  return new Promise((resolve, reject) => {
    ArtistSchema.find({
      name: {
        $regex: new RegExp(name, "ig")
      }
    })
      .sort({ popularity_score: -1 })
      .skip(limite * (n - 1))
      .limit(limite)
      .exec(function(err, artists) {
        if (err) {
          console.log("error en getArtists " + err);
          resolve([]);
        }
        if (!artists) {
          console.error("no artists");
          resolve([]);
        }
        if (artists) {
          console.error("found artists!");
          resolve(artists);
        }
      });
  });
};

var getArtistsByPerformersId = (performers_id = []) => {
  return new Promise((resolve, reject) => {
    ArtistSchema.find({ performer_id: { $in: performers_id } })
      .sort({ popularity_score: -1 })
      .exec(function(err, artists) {
        if (err) {
          console.log("error en getArtists " + err);
          resolve([]);
        }
        if (!artists) {
          resolve([]);
        }
        if (artists) {
          resolve(artists);
        }
      });
  });
};

var getArtistsByPerformersName = (names = []) => {
  return new Promise((resolve, reject) => {
    ArtistSchema.find({ name: { $in: names } })
      .sort({ popularity_score: -1 })
      .exec(function(err, artists) {
        if (err) {
          console.log("error en getArtists " + err);
          resolve([]);
        }
        if (!artists) {
          resolve([]);
        }
        if (artists) {
          resolve(artists);
        }
      });
  });
};

var getArtist = (performer_id = 1) => {
  return new Promise((resolve, reject) => {
    ArtistSchema.findOne(
      {
        performer_id: performer_id
      },
      {},
      {
        sort: { foundArtist: -1 }
      },
      function(err, foundArtist) {
        if (!err) {
          console.log(foundArtist);
          if (null != foundArtist) {
            resolve(foundArtist);
          } else {
            resolve({});
          }
        } else {
          resolve({});
        }
      }
    );
  });
};

var newArtists = (
  performer_id,
  name,
  popularity_score = 0,
  image = {},
  category_id = 0,
  category_name = ""
) => {
  return new Promise((resolve, reject) => {
    getArtist(performer_id).then(foundArtist => {
      if (isDefined(foundArtist.performer_id)) {
        foundArtist.performer_id = performer_id;
        foundArtist.name = name;
        foundArtist.popularity_score = popularity_score;

        //foundArtist.images.push(image);
        if (image.url) {
          pushIfNew(foundArtist.images, image);
        }

        foundArtist.category_id = category_id;
        foundArtist.category_name = category_name;
        foundArtist.save(function(err, artistSaved) {
          if (!err) {
            console.log(
              "Artist Updated!!! " + JSON.stringify(artistSaved.performer_id)
            );
            resolve(artistSaved);
          } else {
            console.log("Error actualizando el artista " + err);
            resolve(undefined);
          }
        });
      } else {
        var artist = new ArtistSchema();
        artist.performer_id = performer_id;
        artist.name = name;
        artist.popularity_score = popularity_score;

        if (image.url) {
          artist.images.push(image);
        }

        artist.category_id = category_id;
        artist.category_name = category_name;
        artist.save(function(err, artistSaved) {
          if (!err) {
            console.log(
              "Artist Saved!!! " + JSON.stringify(artistSaved.performer_id)
            );
            resolve(artistSaved);
          } else {
            console.log("Error guardando en userdatas " + err);
            resolve(undefined);
          }
        });
      }
    });
  });
};

var newArtistWithImages = (
  performer_id,
  name,
  popularity_score = 0,
  images = [],
  category_id = 0,
  category_name = ""
) => {
  return new Promise((resolve, reject) => {
    getArtist(performer_id).then(foundArtist => {
      if (isDefined(foundArtist.performer_id)) {
        foundArtist.performer_id = performer_id;
        foundArtist.name = name;
        foundArtist.popularity_score = popularity_score;

        //foundArtist.images.push(image);

        foundArtist.images = images;

        foundArtist.category_id = category_id;
        foundArtist.category_name = category_name;
        foundArtist.save(function(err, artistSaved) {
          if (!err) {
            console.log(
              "Artist Updated!!! " + JSON.stringify(artistSaved.performer_id)
            );
            resolve(artistSaved);
          } else {
            console.log("Error actualizando el artista " + err);
            resolve(undefined);
          }
        });
      } else {
        var artist = new ArtistSchema();
        artist.performer_id = performer_id;
        artist.name = name;
        artist.popularity_score = popularity_score;

        artist.images = images;

        artist.category_id = category_id;
        artist.category_name = category_name;
        artist.save(function(err, artistSaved) {
          if (!err) {
            console.log(
              "Artist Saved!!! " + JSON.stringify(artistSaved.performer_id)
            );
            resolve(artistSaved);
          } else {
            console.log("Error guardando en userdatas " + err);
            resolve(undefined);
          }
        });
      }
    });
  });
};

var pushIfNew = (images, image) => {
  for (let i = 0; i < images.length; i++) {
    if (images[i].size === image.size) {
      return;
    }
  }
  let newImage = {
    size: image.size,
    url: image.url
  };
  images.push(newImage);
};

module.exports = {
  getArtists,
  getArtist,
  newArtists,
  newArtistWithImages,
  getArtistsByPerformersId,
  getArtistsByPerformersName,
  searchArtistsLikeName
};
