var UserData = require('../../bot/userinfo');
var CategoryModel = require('../category');
var moment = require('moment');


var getIdCategory = (event_type = '', callback) => {
    Categories.find(
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

var getIdCategories = (event_type) => {
    return new Promise((resolve, reject) => {
        CategoryModel
            .find({
                name: {
                    $regex: '".*' + event_type + '.*"',
                    $options: 'i'
                }
            })
            .sort({
                value: 'asc'
            } /*ordenamiento*/ )
            .exec(
                (err, categories) => {
                    if (err) {
                        reject(err)

                    }
                    if (!categories) {
                        resolve(categories)
                    }
                    if (categories) {
                        resolve(categories)

                    }
                });
    })
}



module.exports = {
    getIdCategories

}