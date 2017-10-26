module.exports = function () {

    return {

        send: function (Message, senderId, messagetxt) {
            var moment = require('moment');
            var follow_months = require('./follow_months')


            var repliesArray = [];
            var monthsReplays = follow_months.follow_months(2);

            for (var i = 0; i < monthsReplays.length; i++) {
                repliesArray.push({
                    "content_type": "text",
                    "title": moment(monthsReplays[i]).format('MMM YYYY'),
                    "payload": moment(monthsReplays[i]).format('MMM YYYY')
                });
            }


            Message.markSeen(senderId);
            Message.typingOn(senderId);


            Message.quickReply(senderId, messagetxt, repliesArray);
            Message.typingOff(senderId);
        }
    }

}();