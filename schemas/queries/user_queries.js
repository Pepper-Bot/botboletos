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


 var getUserByFbId = (senderId) => {
     return new Promise((resolve, reject) => {
         UserData2.findOne({
             fbId: senderId
         }, {}, {
             sort: {
                 'sessionEnd': -1
             }
         }, function (err, foundUser) {
             if (err) {
                 console.log('Error en getUserByFbId user_queries ' + err)
                 reject(err)

             }
             if (!foundUser) {
                 console.log(`No se encontró el registro ${senderId} en userdatas: -user_queries, Error: ${err} `);
                 resolve({});
             }
             if (foundUser) {
                 resolve(foundUser)
                 console.log("cusines zomato  >>> " + JSON.stringify(foundUser));
             }
         })
     })
 }


 var createUpdateUserDatas = (senderId, context = '', mlinkSelected = '', userSays = {}, eventSearchSelected = '', querysTevo = '', queryTevoFinal = '', page = 0, per_page = 0, artists = '', musical_genres = '', teams = '', cities = '', messageTitle = '', event_type = '', categorySearchSelected = '', optionsSelected = '', index1 = 0, index2 = 0, index3 = 0, zomatoQs = {}, searchTevoParameters = {}) => {
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
                         'sessionEnd': -1
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
                                 foundUser.page = page
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
                             if (event_type != '') {
                                 foundUser.event_type.push(event_type)
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


                             if (zomatoQs.start) {
                                 foundUser.zomatoQs = zomatoQs
                             }

                             if (searchTevoParameters.q) {
                                 foundUser.searchTevoParameters.q = searchTevoParameters.q
                             }
                             if (searchTevoParameters.city) {
                                 foundUser.searchTevoParameters.city = searchTevoParameters.city
                             }

                             if (searchTevoParameters.lat) {
                                 foundUser.searchTevoParameters.lat = searchTevoParameters.lat
                             }

                             if (searchTevoParameters.lon) {
                                 foundUser.searchTevoParameters.lon = searchTevoParameters.lon
                             }

                             if (searchTevoParameters.occurs_at_gte) {
                                 foundUser.searchTevoParameters.occurs_at_gte = searchTevoParameters.occurs_at_gte
                             }

                             if (searchTevoParameters.occurs_at_lte) {
                                 foundUser.searchTevoParameters.occurs_at_lte = searchTevoParameters.occurs_at_lte
                             }

                             if (searchTevoParameters.page) {
                                 foundUser.searchTevoParameters.page = searchTevoParameters.page
                             }


                             if (searchTevoParameters.per_page) {
                                 foundUser.searchTevoParameters.per_page = searchTevoParameters.per_page
                             }



                             foundUser.save(function (err, userSaved) {
                                 if (!err) {
                                     console.log("foundUser Saved!!! " + JSON.stringify(userSaved.fbId));

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
                                             User.page = page
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
                                         if (event_type != '') {
                                             User.event_type.push(event_type)
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


                                         if (zomatoQs.start) {
                                             User.zomatoQs = zomatoQs
                                         }


                                         if (searchTevoParameters.q) {
                                             User.searchTevoParameters.q = searchTevoParameters.q
                                         }
                                         if (searchTevoParameters.city) {
                                             User.searchTevoParameters.city = searchTevoParameters.city
                                         }

                                         if (searchTevoParameters.lat) {
                                             User.searchTevoParameters.lat = searchTevoParameters.lat
                                         }

                                         if (searchTevoParameters.lon) {
                                             User.searchTevoParameters.lon = searchTevoParameters.lon
                                         }

                                         if (searchTevoParameters.occurs_at_gte) {
                                             User.searchTevoParameters.occurs_at_gte = searchTevoParameters.occurs_at_gte
                                         }

                                         if (searchTevoParameters.occurs_at_lte) {
                                             User.searchTevoParameters.occurs_at_lte = searchTevoParameters.occurs_at_lte
                                         }

                                         if (searchTevoParameters.page) {
                                             User.searchTevoParameters.page = searchTevoParameters.page
                                         }



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


 /**
  * 
  * @param {*} senderId 
  * @param {*} event_clicked 
  * 
  * 
  */
 var upateEventClicked = (senderId, event_clicked = {}, category = {}, performances = []) => {
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
                         'sessionEnd': -1
                     }
                 }, function (err, foundUser) {
                     if (!err) {
                         if (null != foundUser) {
                             if (FBUser.first_name) {
                                 foundUser.fbId = senderId;

                                 foundUser.firstName = FBUser.first_name;
                                 foundUser.LastName = FBUser.last_name;
                                 foundUser.profilePic = FBUser.profile_pic;
                                 foundUser.locale = FBUser.locale;
                                 foundUser.timeZone = FBUser.timezone;
                                 foundUser.gender = FBUser.gender;
                                 foundUser.messageNumber = 1;
                                 foundUser.sessionEnd = moment()
                             }

                             pushIfNewEvent(foundUser.events_clicked, event_clicked)
                             pushIfNewCategory(foundUser.categories, category)


                             for (let i = 0; i < performances.length; i++) {
                                 let performer = performances[i];
                                 pushIfNewPerformer(foundUser.performances, performer);
                             }



                             foundUser.save(function (err, userSaved) {
                                 if (!err) {
                                     console.log("foundUser Saved!!! " + JSON.stringify(userSaved.fbId));

                                     resolve(userSaved)

                                 } else {
                                     console.log('error-upateEventClicked ' + err)
                                     reject(err)

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
                                     }





                                     foundUser.events_clicked.push(event_clicked)
                                     foundUser.categories.push(category)



                                     for (let i = 0; i < performances.length; i++) {
                                         let performer = performances[i];
                                         foundUser.performances.push(performer)
                                     }





                                     User.save(function (err, userSaved) {
                                         if (!err) {
                                             console.log("foundUser Saved!!! " + JSON.stringify(userSaved.fbId));
                                             resolve(userSaved)
                                         } else {
                                             reject(err)
                                             console.log('error-upateEventClicked' + err)
                                         }
                                     });
                                 }
                             })
                         }
                     }
                 })
             }
         })
     })
 }



 var pushIfNewEvent = (events_clicked, event_clicked) => {
     console.log("events_clicked.length" + events_clicked.length);
     for (let i = 0; i < events_clicked.length; i++) {
         if (events_clicked[i].id === event_clicked.id) {
             return;
         }
     }
     events_clicked.push(event_clicked);
 };

 var pushIfNewCategory = (categories, category) => {
     console.log("events_clicked.length" + categories.length);
     for (let i = 0; i < categories.length; i++) {
         if (categories[i].id === category.id) {
             return;
         }
     }
     categories.push(category);
 };

 var pushIfNewPerformer = (performances, performer) => {
     console.log("performances.length" + performances.length);
     for (let i = 0; i < performances.length; i++) {
         if (performances[i].id === performer.id) {
             return;
         }
     }
     performances.push(performer);
 };




 /**
  * 
  * @param {*} senderId 
  */
 var searchUserByFacebookId = senderId => {
     var dbObj = require('../mongodb');
     dbObj.getConnection();

     return new Promise((resolve, reject) => {
         UserData2.findOne({
                 fbId: senderId
             }, {}, {
                 sort: {
                     sessionEnd: -1
                 }
             },
             function (err, foundUser) {
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
     searchUserByFacebookId,
     upateEventClicked

 }