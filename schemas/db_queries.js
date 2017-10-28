var getFinalFBUserSession = (senderId, foundUser) => {
    return new Promise((resolve, reject) => {
        var UserData2 = require('../schemas/userinfo')
        UserData2.findOne({
            fbId: senderId
        }, {}, {
            sort: {
                'sessionStart': -1
            }
        }, function (err, foundUser) {
            if (!err) {
                if (foundUser) {
                    console.log(
                        "foundUser.fbId " + foundUser.fbId + "\n" +
                        "foundUser.firstName " + foundUser.firstName + "\n" +
                        "foundUser.LastName " + foundUser.LastName + "\n" +
                        "foundUser.profilePic " + foundUser.profilePic + "\n" +
                        "foundUser.locale " + foundUser.locale + "\n" +
                        "foundUser.timeZone " + foundUser.timeZone + "\n" +
                        "foundUser.gender " + foundUser.gender + "\n" +
                        "foundUser.sessionStart " + foundUser.sessionStart + "\n"
                    );

                    resolve(foundUser);
                } else {
                    reject(new Error('No user found!!'))

                }
            } else {
                reject(new Error('No existe un array'))
            }
        });
    });
}

module.exports = {
    getFinalFBUserSession

}