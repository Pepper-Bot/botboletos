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




 var createUpdateUserDatas = (senderId, context = '', mlinkSelected = '', userSays = {}, eventSearchSelected = '', querysTevo = '', queryTevoFinal = '', page = 0, per_page = 0, artists = '', musical_genres = '', teams = '', cities = '', categorySearchSelected = '', optionsSelected = '', index1 = 0, index2 = 0, index3 = 0) => {
     var dbObj = require('../mongodb');
     dbObj.getConnection();

     return new Promise((resolve, reject) => {
         UserData.getInfo(senderId, function (err, FBUser) {
             //console.log('FBUser.first_name'+  FBUser.first_name )
             console.log("FBUser.first_name' >>> " + JSON.stringify(FBUser));

             if (!err) {
                 UserData2.findOne({
                     fbId: senderId
                 }, {}, {
                     sort: {
                         'sessionStart': -1
                     }
                 }, function (err, foundUser) {
                     if (!err) {
                         if (null != foundUser) {
                             foundUser = JSON.parse(foundUser);

                             
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
                                 foundUser.page = foundUser.page + page
                             } else {
                                 foundUser.page = 0
                             }

                             if (per_page > 0) {
                                 foundUser.per_page = per_page
                             }

                             if(artists !=''){
                                foundUser.artists = artists
                             }

                             if(musical_genres !=''){
                                foundUser.musical_genres = musical_genres
                             }

                             if(teams !=''){
                                foundUser.teams = teams
                             }
                  

                             if(cities !=''){
                                foundUser.cities = cities
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


                             var User = new UserData2; {
                                 User.fbId = senderId;
                                 User.firstName = FBUser.first_name;
                                 User.LastName = FBUser.last_name;
                                 User.profilePic = FBUser.profile_pic;
                                 User.locale = FBUser.locale;
                                 User.timeZone = FBUser.timezone;
                                 User.gender = FBUser.gender;
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
                                    User.page = foundUser.page + page
                                } else {
                                    User.page = 0
                                }
   
                                if (per_page > 0) {
                                    User.per_page = per_page
                                }
   
                                if(artists !=''){
                                    User.artists = artists
                                }
   
                                if(musical_genres !=''){
                                    User.musical_genres = musical_genres
                                }
   
                                if(teams !=''){
                                    User.teams = teams
                                }
                     
   
                                if(cities !=''){
                                    User.cities = cities
                                }
   
   
                                if (categorySearchSelected != '') {
                                    User.categorySearchSelected.push(categorySearchSelected)
                                }
   
                                if (optionsSelected != '') {
                                    foundUserUser.optionsSelected.push(optionsSelected)
                                }
   
                                if (userSays.typed) {
                                    User.userSays.push(userSays)
   
                                }


                                 User.showMemore.index1 = index1
                                 User.showMemore.index2 = index2
                                 User.showMemore.index3 = index3



                                 User.save(function (err, userSaved) {
                                     if (!err) {
                                         console.log("user New Saved Saved!!! " + JSON.stringify(userSaved.fbId));

                                         resolve(userSaved)

                                     } else {
                                         console.log('Error guardando en userdatas New UserData' + err)
                                     }
                                 });

                             }



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