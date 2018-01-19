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

     return new Promise((resolve, reject) => {
         UserData2.findOne({
             fbId: senderId
         }, {}, {
             sort: {
                 'sessionStart': -1
             }
         }, function (err, foundUser) {
             if (!err) {
                 if (null != foundUser) {

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

                     UserData.getInfo(senderId, function (err, result) {
                         console.log('Dentro de UserData');
                         if (!err) {

                             var bodyObj = JSON.parse(result);
                             console.log(result);

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
                                     User.mlinkSelected.push(mlinkSelected)
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
                     });
                 }
             }

         });
     });
 }






 module.exports = {
     getUsersGroupByFBId,
     createUserDatas

 }