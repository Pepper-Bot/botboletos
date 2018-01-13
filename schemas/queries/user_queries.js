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

module.exports = {
    getUsersGroupByFBId

}