 var UserData = require('../../bot/userinfo');
 var UserData2 = require('../userinfo');

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




 var createUserDatas = (senderId, context = '', mlinkSelected = '', categorySearchSelected = '', optionsSelected = '', index1 = 0, index2 = 0, index3 = 0) => {
     var dbObj = require('../mongodb');
     dbObj.getConnection();

     return new Promise((resolve, reject) => {
         UserData.getInfo(senderId, function (err, FBUser) {
             console.log('Dentro de UserData');
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
                             foundUser.fbId = senderId;
                             foundUser.firstName = FBUser.first_name;
                             foundUser.LastName = FBUser.last_name;
                             foundUser.profilePic = FBUser.profile_pic;
                             foundUser.locale = FBUser.locale;
                             foundUser.timeZone = FBUser.timezone;
                             foundUser.gender = FBUser.gender;
                             foundUser.messageNumber = 1;



                             if (context != '') {
                                 foundUser.context = context
                             }

                             if (mlinkSelected != '') {
                                 foundUser.mlinkSelected = mlinkSelected
                             }

                             if (categorySearchSelected != '') {
                                 foundUser.categorySearchSelected.push(categorySearchSelected)
                             }

                             if (optionsSelected != '') {
                                 foundUser.optionsSelected.push(optionsSelected)
                             }


                             foundUser.showMemore.index1 = index1
                             foundUser.showMemore.index2 = index2
                             foundUser.showMemore.index3 = index3


                             foundUser.save(function (err, userSaved) {
                                 if (!err) {
                                     console.log("foundUser Saved!!! " + JSON.stringify(userSaved));

                                     resolve(userSaved)

                                 } else {
                                     console.log('Error guardando en userdatas')
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

                                 if (categorySearchSelected != '') {
                                     User.categorySearchSelected.push(categorySearchSelected)
                                 }

                                 if (optionsSelected != '') {
                                     User.optionsSelected.push(optionsSelected)
                                 }

                                 User.showMemore.index1 = index1
                                 User.showMemore.index2 = index2
                                 User.showMemore.index3 = index3



                                 User.save(function (err, userSaved) {
                                     if (!err) {
                                         console.log("user New Saved Saved!!! " + JSON.stringify(userSaved));

                                         resolve(userSaved)

                                     } else {
                                         console.log('Error guardando en userdatas')
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
     createUserDatas

 }