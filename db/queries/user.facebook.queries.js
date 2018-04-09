var UserFacebook = require("../schemas/user.facebook.schema");

/**
 *
 * @param {*} facebookId
 * @param {*} name
 * @param {*} birthday
 * @param {*} email
 * @param {*} music
 * @description Función para guardar actualizar usuario de facebook.
 */
var createUpdateUserFacebook = (
  facebookId = "",
  name = "",
  birthday = "",
  email = "",
  music = []
) => {
  var dbObj = require("../DB");
  dbObj.getConnection();

  return new Promise((resolve, reject) => {
    UserFacebook.findOne(
      {
        facebookId: facebookId
      },
      {},
      {
        sort: {
          facebookId: -1
        }
      },
      function(err, foundUser) {
        if (null != foundUser) {
          foundUser.facebookId = facebookId;
          foundUser.name = name;
          foundUser.birthday = birthday;
          foundUser.email = email;
          foundUser.music = music;

          foundUser.save(function(err, userSaved) {
            if (!err) {
              console.log(
                "UserFacebook Saved!!! " + JSON.stringify(userSaved.facebookId)
              );

              resolve(userSaved);
            } else {
              console.log("Error en createUpdateUserFacebook" + err);
            }
          });
        } else {
          let User = new UserFacebook();
          User.facebookId = facebookId;
          User.name = name;
          User.birthday = birthday;
          User.email = email;
          User.music = music;

          User.save(function(err, userSaved) {
            if (!err) {
              console.log(
                "UserFacebook Saved!!! " + JSON.stringify(userSaved.facebookId)
              );

              resolve(userSaved);
            } else {
              console.log("Error guardando en userdatas " + err);
            }
          });
        }
      }
    );
  });
};

/**
 *
 * @param {*} facebookId
 * @param {*} senderId
 *
 * @description Función para actualizar el sender Id de un usuario de facebook
 */
var updateUserFacebookSenderId = (facebookId, senderId = "") => {
  var dbObj = require("../DB");
  dbObj.getConnection();

  return new Promise((resolve, reject) => {
    UserFacebook.findOne(
      {
        facebookId: facebookId
      },
      {},
      {
        sort: {
          facebookId: -1
        }
      },
      function(err, foundUser) {
        if (null != foundUser) {
          foundUser.facebookId = facebookId;
          foundUser.fbId = senderId;

          foundUser.save(function(err, userSaved) {
            if (!err) {
              console.log(
                "UserFacebook Sender Id Updated!!! " +
                  JSON.stringify(userSaved.facebookId)
              );

              resolve(userSaved);
            } else {
              console.log("Error en updateUserFacebookSenderId " + err);
            }
          });
        }
      }
    );
  });
};

/**
 *
 * @param {*} facebookId
 *
 * @description Función para buscar el usuario por facebookId
 */
var searchUserFacebookByFacebookId = (facebookId) => {
  var dbObj = require("../DB");
  dbObj.getConnection();

  return new Promise((resolve, reject) => {
    UserFacebook.findOne(
      {
        facebookId: facebookId
      },
      {},
      {
        sort: {
          facebookId: -1
        }
      },
      function(err, foundUser) {

        if (null != foundUser) {
         resolve(foundUser )
      
        }else{
          resolve(null)
        }
      }
    );
  });
};



module.exports = {
  createUpdateUserFacebook,
  updateUserFacebookSenderId,
  searchUserFacebookByFacebookId
};
