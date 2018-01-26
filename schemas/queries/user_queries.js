 var UserData = require('../../bot/userinfo');
 var UserData2 = require('../userinfo');
 var moment = require('moment');


 var getUsersGroupByFBId = (callback) => {
     UserData.aggregate(
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
                     "cantidad": {
                         $sum: 1
                     }
                 }
             }

         ],
         function (error, result) {
             if (error) {
                 callback(true, null);
             } else {

                 callback(null, result);
             }
         });
 }




 var createUpdateUserDatas = (senderId, context = '', mlinkSelected = '', userSays = {}, eventSearchSelected = '', querysTevo = '', queryTevoFinal = '', page = 0, per_page = 0, artists = '', musical_genres = '', teams = '', cities = '', messageTitle = '', categorySearchSelected = '', optionsSelected = '', index1 = 0, index2 = 0, index3 = 0) => {
     var dbObj = require('../mongodb');
     dbObj.getConnection();

     return new Promise((resolve, reject) => {
         UserData.getInfo(senderId, function (err, FBUser) {
             //console.log('FBUser.first_name'+  FBUser.first_name )
             console.log("FBUser.first_name' >>> " + JSON.stringify(FBUser));

             if (!err) {
                 var FBUser = JSON.parse(FBUser);
                 UserData2.findOne({
                     fbId: senderId
                 }, {}, {
                     sort: {
                         'sessionStart': -1
                     }
                 }, function (err, foundUser) {
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
                             foundUser.sessionEnd = moment()


                             if (context != '') {
                                 foundUser.context = context
                             }

                             if (mlinkSelected != '') {
                                 foundUser.mlinkSelected = mlinkSelected
                             }

                             if (eventSearchSelected != '') {
                                 foundUser.eventSearchSelected.push(eventSearchSelected)
                             }

                             if (querysTevo != '') {
                                 foundUser.querysTevo.push(querysTevo)
                             }

                             if (queryTevoFinal != '') {
                                 foundUser.queryTevoFinal = queryTevoFinal
                             }

                             if (page > 0) {
                                 foundUser.page =  page
                             } else {
                                 foundUser.page = 1
                             }

                             if (per_page > 0) {
                                 foundUser.per_page = per_page
                             }

                             if (artists != '') {
                                 foundUser.artists = artists
                             }

                             if (musical_genres != '') {
                                 foundUser.musical_genres = musical_genres
                             }

                             if (teams != '') {
                                 foundUser.teams = teams
                             }


                             if (cities != '') {
                                 foundUser.cities = cities
                             }

                             if (messageTitle != '') {
                                 foundUser.messageTitle = messageTitle
                             }


                             if (categorySearchSelected != '') {
                                 foundUser.categorySearchSelected.push(categorySearchSelected)
                             }

                             if (optionsSelected != '') {
                                 foundUser.optionsSelected.push(optionsSelected)
                             }

                             if (userSays.typed) {
                                 foundUser.userSays.push(userSays)

                             }

                             console.log("foundUser.userSays.lenght " + JSON.stringify(userSays));

                             foundUser.showMemore.index1 = index1
                             foundUser.showMemore.index2 = index2
                             foundUser.showMemore.index3 = index3


                             foundUser.save(function (err, userSaved) {
                                 if (!err) {
                                     console.log("foundUser Saved!!! " + JSON.stringify(userSaved));

                                     resolve(userSaved)

                                 } else {
                                     console.log('Error guardando en userdatas ' + err)
                                 }
                             });
                         } else {

                             UserData.getInfo(senderId, function (err, result) {
                                 console.log('Dentro de UserData');
                                 if (!err) {

                                     var bodyObj = JSON.parse(result);
                                     console.log('guardando el usuario ' + result);


                                     var User = new UserData2; {
                                         User.fbId = senderId;
                                         User.firstName = bodyObj.first_name;
                                         User.LastName = bodyObj.last_name;
                                         User.profilePic = bodyObj.profile_pic;
                                         User.locale = bodyObj.locale;
                                         User.timeZone = bodyObj.timezone;
                                         User.gender = bodyObj.gender;
                                         User.messageNumber = 1;



                                         if (context != '') {
                                             User.context = context
                                         }

                                         if (mlinkSelected != '') {
                                             User.mlinkSelected = mlinkSelected
                                         }

                                         if (eventSearchSelected != '') {
                                             User.eventSearchSelected.push(eventSearchSelected)
                                         }

                                         if (querysTevo != '') {
                                             User.querysTevo.push(querysTevo)
                                         }



                                         if (queryTevoFinal != '') {
                                             User.queryTevoFinal = queryTevoFinal
                                         }

                                         if (page > 0) {
                                             User.page =  page
                                         } else {
                                             User.page = 1
                                         }

                                         if (per_page > 0) {
                                             User.per_page = per_page
                                         }

                                         if (artists != '') {
                                             User.artists = artists
                                         }

                                         if (musical_genres != '') {
                                             User.musical_genres = musical_genres
                                         }

                                         if (teams != '') {
                                             User.teams = teams
                                         }


                                         if (cities != '') {
                                             User.cities = cities
                                         }

                                         if (messageTitle != '') {
                                            User.messageTitle = messageTitle
                                        }

                                        
                                         if (categorySearchSelected != '') {
                                             User.categorySearchSelected.push(categorySearchSelected)
                                         }

                                         if (optionsSelected != '') {
                                             User.optionsSelected.push(optionsSelected)
                                         }

                                         if (userSays.typed) {
                                             User.userSays.push(userSays)

                                         }


                                         User.showMemore.index1 = index1
                                         User.showMemore.index2 = index2
                                         User.showMemore.index3 = index3

                                         User.save();
                                     }
                                 }
                             });
                         }
                     }
                 });
             }
         })
     });
 }






 module.exports = {
     getUsersGroupByFBId,
     createUpdateUserDatas

 }