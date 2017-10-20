module.exports = function () {

    return {

        send: function (Message, senderId, messagetxt) {
            var moment = require('moment');

            var monthsReplays = new Array();
            var currentDate = moment();
            monthsReplays.push(currentDate);
            var followMonth;
            var followMonthEnd;
            for (var i = 1; i <= 2; i++) {

                 followMonth = moment(currentDate).add(1, 'M');
                 followMonthEnd = moment(followMonth).endOf('month');

                if (currentDate.date() != followMonth.date() && followMonth.isSame(followMonthEnd.format('YYYY-MM-DD'))) {
                    followMonth = followMonth.add(1, 'd');
                }

                currentDate = followMonth;

                monthsReplays.push(followMonth);
            }


            var repliesArray  =[];
            for (var i = 0; i < monthsReplays.length; i++) {
                var currMonthName = moment(monthsReplays[i]).format('MMM');
                console.log("MESREPLAYY >>>>" + currMonthName);

                repliesArray.push({
                    "content_type": "text",
                    "title": moment(monthsReplays[i]).format('MMM YYYY'),
                    "payload": "find_my_event_month"
    
    
                });

            }

          


            



            Message.markSeen(senderId);
            Message.typingOn(senderId);

            var replies = [{
                    "content_type": "text",
                    "title": "Food",
                    "payload": "find_my_event_month"

                },
                {
                    "content_type": "text",
                    "title": "Drinks",
                    "payload": "GET_LOCATION_DRINKS"
                },
                {
                    "content_type": "text",
                    "title": "Event",
                    "payload": "GET_LOCATION_EVENTS"
                }
            ];
            Message.quickReply(senderId, messagetxt, repliesArray);
            Message.typingOff(senderId);
        }
    }

}();