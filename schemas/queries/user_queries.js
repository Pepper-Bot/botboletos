var getUsersGroupByFBId = (callback) => {
    var UserData = require('../../schemas/userinfo')
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




var MongoClient = require('mongodb').MongoClient;
 
var url = 'mongodb://localhost:27017/mydb';
MongoClient.connect(url, function (err, db) {
    var mycol = db.collection('mycol');
 
    var duplicates = [];
    mycol.aggregate([
             
            {
                $match: {
                    myfield: {"$ne": ''} // myfield es el campo por el que queremos borrar los duplicados
                }
            },
            {
                $group: {
                    _id: {myfield: "$myfield"},
                    dups: {"$addToSet": "$_id"},
                    count: {"$sum": 1}
                }
            },
            {
                $match: {
                    count: {"$gt": 1}
                }
            }
        ], function (err, result) {
            if (err) {
                console.error(err);
                return db.close();
            }
 
            result.forEach(function (doc) {
                doc.dups.shift(); // Nos quedamos con el primer elemento
                doc.dups.forEach(function (dupId) {
                    duplicates.push(dupId);
                });
            });
 
            mycol.remove({_id: {$in: duplicates}}, function (err, result) {
                if (err) {
                    console.error(err);
                }
 
                db.close();
            });
        });



        
module.exports = {
    getUsersGroupByFBId

}