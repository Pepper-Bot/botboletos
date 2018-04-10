var UserData = require("../../requests/facebook_requests/user");
var UserData2 = require("../../schemas/userinfo");
var moment = require("moment");

var getUsersGroupByFBId = () => {
  return new Promise((resolve, reject) => {
    UserData2.aggregate(
      [
        {
          $match: {
            firstName: {
              $exists: true
            }
          }
        },
        {
          $sort: {
            lastName: -1,
            firstName: -1
          }
        },
        {
          $group: {
            _id: {
              fbId: "$fbId",
              lastName: "$LastName",
              firstName: "$firstName"
            },
            cantidad: {
              $sum: 1
            }
          }
        }
      ],
      function(error, result) {
        if (error) {
          resolve([]);
        } else {
          resolve(result);
        }
      }
    );
  });
};

var getUserByFbId = senderId => {
  return new Promise((resolve, reject) => {
    UserData2.findOne(
      {
        fbId: senderId
      },
      {},
      {
        sort: {
          sessionEnd: -1
        }
      },
      function(err, foundUser) {
        if (err) {
          console.log("Error en getUserByFbId user_queries " + err);
          reject(err);
        }
        if (!foundUser) {
          console.log("Error en getUserByFbId user_queries " + err);
          reject(err);
        }
        if (foundUser) {
          resolve(foundUser);
          console.log("user found  >>> " + JSON.stringify(foundUser.fbId));
        }
      }
    );
  });
};

var createUpdateUserDatas = (
  senderId,
  context = "",
  mlinkSelected = "",
  userSays = {},
  eventSearchSelected = "",
  querysTevo = "",
  queryTevoFinal = "",
  page = 0,
  per_page = 0,
  artists = "",
  musical_genres = "",
  teams = "",
  cities = "",
  messageTitle = "",
  event_type = "",
  categorySearchSelected = "",
  optionsSelected = "",
  index1 = 0,
  index2 = 0,
  index3 = 0,
  zomatoQs = {},
  searchTevoParameters = {}
) => {
  var dbObj = require("../DB");
  dbObj.getConnection();

  return new Promise((resolve, reject) => {
    UserData.getInfo(senderId, function(err, FBUser) {
      //console.log('FBUser.first_name'+  FBUser.first_name )
      console.log("FBUser.first_name' >>> " + JSON.stringify(FBUser));

      if (!err) {
        var FBUser = JSON.parse(FBUser);
        UserData2.findOne(
          {
            fbId: senderId
          },
          {},
          {
            sort: {
              sessionEnd: -1
            }
          },
          function(err, foundUser) {
            if (!err) {
              if (null != foundUser) {
                foundUser.fbId = senderId;

                foundUser.firstName = FBUser.first_name;
                foundUser.LastName = FBUser.last_name;
                foundUser.profilePic = FBUser.profile_pic;
                foundUser.locale = FBUser.locale;
                foundUser.timeZone = FBUser.timezone;
                foundUser.gender = FBUser.gender;
                foundUser.messageNumber = 1;
                foundUser.sessionEnd = moment();

                if (context != "") {
                  foundUser.context = context;
                }

                if (mlinkSelected != "") {
                  foundUser.mlinkSelected = mlinkSelected;
                }

                if (eventSearchSelected != "") {
                  foundUser.eventSearchSelected.push(eventSearchSelected);
                }

                if (querysTevo != "") {
                  foundUser.querysTevo.push(querysTevo);
                }

                if (queryTevoFinal != "") {
                  foundUser.queryTevoFinal = queryTevoFinal;
                }

                if (page > 0) {
                  foundUser.page = page;
                } else {
                  foundUser.page = 1;
                }

                if (per_page > 0) {
                  foundUser.per_page = per_page;
                }

                if (artists != "") {
                  foundUser.artists = artists;
                }

                if (musical_genres != "") {
                  foundUser.musical_genres = musical_genres;
                }

                if (teams != "") {
                  foundUser.teams = teams;
                }

                if (cities != "") {
                  foundUser.cities = cities;
                }

                if (messageTitle != "") {
                  foundUser.messageTitle = messageTitle;
                }
                if (event_type != "") {
                  foundUser.event_type.push(event_type);
                }

                if (categorySearchSelected != "") {
                  foundUser.categorySearchSelected.push(categorySearchSelected);
                }

                if (optionsSelected != "") {
                  foundUser.optionsSelected.push(optionsSelected);
                }

                if (userSays.typed) {
                  foundUser.userSays.push(userSays);
                }

                console.log(
                  "foundUser.userSays.lenght " + JSON.stringify(userSays)
                );

                foundUser.showMemore.index1 = index1;
                foundUser.showMemore.index2 = index2;
                foundUser.showMemore.index3 = index3;

                if (zomatoQs.start) {
                  foundUser.zomatoQs = zomatoQs;
                }

                if (searchTevoParameters.q) {
                  foundUser.searchTevoParameters.q = searchTevoParameters.q;
                }
                if (searchTevoParameters.city) {
                  foundUser.searchTevoParameters.city =
                    searchTevoParameters.city;
                }

                if (searchTevoParameters.lat) {
                  foundUser.searchTevoParameters.lat = searchTevoParameters.lat;
                }

                if (searchTevoParameters.lon) {
                  foundUser.searchTevoParameters.lon = searchTevoParameters.lon;
                }

                if (searchTevoParameters.occurs_at_gte) {
                  foundUser.searchTevoParameters.occurs_at_gte =
                    searchTevoParameters.occurs_at_gte;
                }

                if (searchTevoParameters.occurs_at_lte) {
                  foundUser.searchTevoParameters.occurs_at_lte =
                    searchTevoParameters.occurs_at_lte;
                }

                if (searchTevoParameters.page) {
                  foundUser.searchTevoParameters.page =
                    searchTevoParameters.page;
                }

                if (searchTevoParameters.per_page) {
                  foundUser.searchTevoParameters.per_page =
                    searchTevoParameters.per_page;
                }

                foundUser.save(function(err, userSaved) {
                  if (!err) {
                    console.log(
                      "foundUser Saved!!! " + JSON.stringify(userSaved.fbId)
                    );

                    resolve(userSaved);
                  } else {
                    console.log("Error guardando en userdatas " + err);
                  }
                });
              } else {
                UserData.getInfo(senderId, function(err, result) {
                  console.log("Dentro de UserData");
                  if (!err) {
                    var bodyObj = JSON.parse(result);
                    console.log("guardando el usuario " + result);

                    var User = new UserData2();
                    {
                      User.fbId = senderId;
                      User.firstName = bodyObj.first_name;
                      User.LastName = bodyObj.last_name;
                      User.profilePic = bodyObj.profile_pic;
                      User.locale = bodyObj.locale;
                      User.timeZone = bodyObj.timezone;
                      User.gender = bodyObj.gender;
                      User.messageNumber = 1;

                      if (context != "") {
                        User.context = context;
                      }

                      if (mlinkSelected != "") {
                        User.mlinkSelected = mlinkSelected;
                      }

                      if (eventSearchSelected != "") {
                        User.eventSearchSelected.push(eventSearchSelected);
                      }

                      if (querysTevo != "") {
                        User.querysTevo.push(querysTevo);
                      }

                      if (queryTevoFinal != "") {
                        User.queryTevoFinal = queryTevoFinal;
                      }

                      if (page > 0) {
                        User.page = page;
                      } else {
                        User.page = 1;
                      }

                      if (per_page > 0) {
                        User.per_page = per_page;
                      }

                      if (artists != "") {
                        User.artists = artists;
                      }

                      if (musical_genres != "") {
                        User.musical_genres = musical_genres;
                      }

                      if (teams != "") {
                        User.teams = teams;
                      }

                      if (cities != "") {
                        User.cities = cities;
                      }

                      if (messageTitle != "") {
                        User.messageTitle = messageTitle;
                      }
                      if (event_type != "") {
                        User.event_type.push(event_type);
                      }

                      if (categorySearchSelected != "") {
                        User.categorySearchSelected.push(
                          categorySearchSelected
                        );
                      }

                      if (optionsSelected != "") {
                        User.optionsSelected.push(optionsSelected);
                      }

                      if (userSays.typed) {
                        User.userSays.push(userSays);
                      }

                      User.showMemore.index1 = index1;
                      User.showMemore.index2 = index2;
                      User.showMemore.index3 = index3;

                      if (zomatoQs.start) {
                        User.zomatoQs = zomatoQs;
                      }

                      if (searchTevoParameters.q) {
                        User.searchTevoParameters.q = searchTevoParameters.q;
                      }
                      if (searchTevoParameters.city) {
                        User.searchTevoParameters.city =
                          searchTevoParameters.city;
                      }

                      if (searchTevoParameters.lat) {
                        User.searchTevoParameters.lat =
                          searchTevoParameters.lat;
                      }

                      if (searchTevoParameters.lon) {
                        User.searchTevoParameters.lon =
                          searchTevoParameters.lon;
                      }

                      if (searchTevoParameters.occurs_at_gte) {
                        User.searchTevoParameters.occurs_at_gte =
                          searchTevoParameters.occurs_at_gte;
                      }

                      if (searchTevoParameters.occurs_at_lte) {
                        User.searchTevoParameters.occurs_at_lte =
                          searchTevoParameters.occurs_at_lte;
                      }

                      if (searchTevoParameters.page) {
                        User.searchTevoParameters.page =
                          searchTevoParameters.page;
                      }

                      User.save();
                    }
                  }
                });
              }
            }
          }
        );
      }
    });
  });
};

var createUpdateUseSelectArtist = (senderId, artists = []) => {
  var dbObj = require("../DB");
  dbObj.getConnection();
  return new Promise((resolve, reject) => {
    UserData.getInfo(senderId, function(err, FBUser) {
      //console.log('FBUser.first_name'+  FBUser.first_name )
      console.log("FBUser.first_name' >>> " + JSON.stringify(FBUser));
      if (!err) {
        console.log("1");
        var FBUser = JSON.parse(FBUser);
        UserData2.findOne(
          {
            fbId: senderId
          },
          {},
          {
            sort: {
              sessionEnd: -1
            }
          },
          function(err, foundUser) {
            if (!err) {
              if (null != foundUser) {
                foundUser.fbId = senderId;
                foundUser.firstName = FBUser.first_name;
                foundUser.LastName = FBUser.last_name;
                foundUser.profilePic = FBUser.profile_pic;
                foundUser.locale = FBUser.locale;
                foundUser.timeZone = FBUser.timezone;
                foundUser.gender = FBUser.gender;
                foundUser.messageNumber = 1;
                foundUser.sessionEnd = moment();

                //foundUser.artistsSelected.push(artists);
                /*for(let i =0 ; i< artists.length ; i++ ){
                  let artist = artists[i]
                  pushIfNew(foundUser.artistsSelected,artist   )
                }*/

                foundUser.artistsSelected = artists;

                foundUser.save(function(err, userSaved) {
                  if (!err) {
                    console.log(
                      "foundUser Saved!!! " + JSON.stringify(userSaved.fbId)
                    );

                    resolve(userSaved);
                  } else {
                    console.log("Error guardando en userdatas " + err);
                    reject(err);
                  }
                });
              } else {
                UserData.getInfo(senderId, function(err, result) {
                  console.log("Dentro de UserData");
                  if (!err) {
                    var bodyObj = JSON.parse(result);
                    console.log("guardando el usuario " + result);

                    var User = new UserData2();
                    {
                      User.fbId = senderId;
                      User.firstName = bodyObj.first_name;
                      User.LastName = bodyObj.last_name;
                      User.profilePic = bodyObj.profile_pic;
                      User.locale = bodyObj.locale;
                      User.timeZone = bodyObj.timezone;
                      User.gender = bodyObj.gender;
                      User.messageNumber = 1;

                      /*for (let i = 0; i < artists.length; i++) {
                        let artist = artists[i];
                        pushIfNew(User.artistsSelected, artist);
                      }*/
                      User.artistsSelected = artists;

                      User.save(function(err, userSaved) {
                        if (!err) {
                          console.log(
                            "user Saved!!! " + JSON.stringify(userSaved.fbId)
                          );

                          resolve(userSaved);
                        } else {
                          console.log("Error guardando en userdatas " + err);
                          reject(err);
                        }
                      });
                    }
                  }
                });
              }
            }
          }
        );
      }
    });
  });
};

var createUpdateUserSpotifyId = (senderId, spotify_id) => {
  var dbObj = require("../DB");
  dbObj.getConnection();
  return new Promise((resolve, reject) => {
    UserData.getInfo(senderId, function(err, FBUser) {
      //console.log('FBUser.first_name'+  FBUser.first_name )
      console.log("FBUser.first_name' >>> " + JSON.stringify(FBUser));
      if (!err) {
        console.log("1");
        var FBUser = JSON.parse(FBUser);
        UserData2.findOne(
          {
            fbId: senderId
          },
          {},
          {
            sort: {
              sessionEnd: -1
            }
          },
          function(err, foundUser) {
            if (!err) {
              if (null != foundUser) {
                foundUser.fbId = senderId;
                foundUser.firstName = FBUser.first_name;
                foundUser.LastName = FBUser.last_name;
                foundUser.profilePic = FBUser.profile_pic;
                foundUser.locale = FBUser.locale;
                foundUser.timeZone = FBUser.timezone;
                foundUser.gender = FBUser.gender;
                foundUser.messageNumber = 1;
                foundUser.sessionEnd = moment();

                //foundUser.artistsSelected.push(artists);

                foundUser.spotify_id = spotify_id;

                foundUser.save(function(err, userSaved) {
                  if (!err) {
                    console.log(
                      "foundUser Saved!!! " + JSON.stringify(userSaved.fbId)
                    );

                    resolve(userSaved);
                  } else {
                    console.log("Error guardando en userdatas " + err);
                    reject(err);
                  }
                });
              } else {
                UserData.getInfo(senderId, function(err, result) {
                  console.log("Dentro de UserData");
                  if (!err) {
                    var bodyObj = JSON.parse(result);
                    console.log("guardando el usuario " + result);

                    var User = new UserData2();
                    {
                      User.fbId = senderId;
                      User.firstName = bodyObj.first_name;
                      User.LastName = bodyObj.last_name;
                      User.profilePic = bodyObj.profile_pic;
                      User.locale = bodyObj.locale;
                      User.timeZone = bodyObj.timezone;
                      User.gender = bodyObj.gender;
                      User.messageNumber = 1;

                      User.spotify_id = spotify_id;

                      User.save(function(err, userSaved) {
                        if (!err) {
                          console.log(
                            "user Saved!!! " + JSON.stringify(userSaved.fbId)
                          );

                          resolve(userSaved);
                        } else {
                          console.log("Error guardando en userdatas " + err);
                          reject(err);
                        }
                      });
                    }
                  }
                });
              }
            }
          }
        );
      }
    });
  });
};

var pushIfNew = (artists, artist) => {
  console.log("artists.length" + artists.length);
  for (let i = 0; i < artists.length; i++) {
    if (artists[i].performer_id === artist.performer_id) {
      artists[i].times = artists[i].times + 1;
      return;
    }
  }
  let newArtist = {
    performer_id: artist.performer_id,
    name: artist.name
  };
  artists.push(newArtist);
};

/**
 *
 * @param {*} senderId
 * @param {*} artistHasEvent
 */
var createUpdateUserArtistHasEvent = (senderId, artistHasEvent) => {
  var dbObj = require("../DB");
  dbObj.getConnection();
  return new Promise((resolve, reject) => {
    UserData.getInfo(senderId, function(err, FBUser) {
      //console.log('FBUser.first_name'+  FBUser.first_name )
      console.log("FBUser.first_name' >>> " + JSON.stringify(FBUser));
      if (!err) {
        console.log("1");
        var FBUser = JSON.parse(FBUser);
        UserData2.findOne(
          {
            fbId: senderId
          },
          {},
          {
            sort: {
              sessionEnd: -1
            }
          },
          function(err, foundUser) {
            if (!err) {
              if (null != foundUser) {
                foundUser.fbId = senderId;
                foundUser.firstName = FBUser.first_name;
                foundUser.LastName = FBUser.last_name;
                foundUser.profilePic = FBUser.profile_pic;
                foundUser.locale = FBUser.locale;
                foundUser.timeZone = FBUser.timezone;
                foundUser.gender = FBUser.gender;
                foundUser.messageNumber = 1;
                foundUser.sessionEnd = moment();

                //foundUser.artistsSelected.push(artists);

                foundUser.artistHasEvent = artistHasEvent;

                foundUser.save(function(err, userSaved) {
                  if (!err) {
                    console.log(
                      "foundUser Saved!!! " + JSON.stringify(userSaved.fbId)
                    );

                    resolve(userSaved);
                  } else {
                    console.log("Error guardando en userdatas " + err);
                    reject(err);
                  }
                });
              } else {
                UserData.getInfo(senderId, function(err, result) {
                  console.log("Dentro de UserData");
                  if (!err) {
                    var bodyObj = JSON.parse(result);
                    console.log("guardando el usuario " + result);

                    var User = new UserData2();
                    {
                      User.fbId = senderId;
                      User.firstName = bodyObj.first_name;
                      User.LastName = bodyObj.last_name;
                      User.profilePic = bodyObj.profile_pic;
                      User.locale = bodyObj.locale;
                      User.timeZone = bodyObj.timezone;
                      User.gender = bodyObj.gender;
                      User.messageNumber = 1;

                      User.artistHasEvent = artistHasEvent;

                      User.save(function(err, userSaved) {
                        if (!err) {
                          console.log(
                            "user Saved!!! " + JSON.stringify(userSaved.fbId)
                          );

                          resolve(userSaved);
                        } else {
                          console.log("Error guardando en userdatas " + err);
                          reject(err);
                        }
                      });
                    }
                  }
                });
              }
            }
          }
        );
      }
    });
  });
};

/**
 * 
 * @param {*} senderId 
 */
var searchUserByFacebookId = senderId => {
  return new Promise((resolve, reject) => {
    UserData2.findOne(
      {
        fbId: senderId
      },
      {},
      {
        sort: {
          sessionEnd: -1
        }
      },
      function(err, foundUser) {
        if (!err) {
          if (null != foundUser) {
            resolve(foundUser);
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      }
    );
  });
};

module.exports = {
  getUsersGroupByFBId,
  createUpdateUserDatas,
  getUserByFbId,
  createUpdateUseSelectArtist,
  createUpdateUserSpotifyId,
  createUpdateUserArtistHasEvent,
  searchUserByFacebookId
};
