module.exports = function () {

    return {

        send: function (Message, senderId, messagetxt) {
            var moment = require('moment');

            var fechaExamen = moment("2015 05 30", "YYYY MM DD");

            console.log(fechaExamen.format("DD MM YYYY"));

            //dia de la semana
            console.log("dia de la semana :" + fechaExamen.day());

            console.log("mes:" + fechaExamen.month());

            console.log("año:" + fechaExamen.year());

            var hoy = moment();

            var diferencia = fechaExamen.diff(hoy, "days");

            console.log("la diferencia en dias es" + diferencia);


            var currMonthName = moment().format('MMM');
            var prevMonthName = moment().subtract(1, "month").format('MMM');

            console.log(currMonthName);
            console.log(prevMonthName);




            var monthsReplays = new Array();
            var currentDate = moment();
            monthsReplays.push(currentDate);
            var followMonth;
            var followMonthEnd;
            for (var i = 1; i <= 2; i++) {

                var followMonth = moment(currentDate).add(1, 'M');
                var followMonthEnd = moment(followMonth).endOf('month');

                if (currentDate.date() != followMonth.date() && followMonth.isSame(followMonthEnd.format('YYYY-MM-DD'))) {
                    followMonth = followMonth.add(1, 'd');
                }

                monthsReplays.push(followMonth);
            }

            for (var i = 0; i < monthsReplays.length; i++) {
                var currMonthName = moment(monthsReplays[i]).format('MMM');
                console.log("MESREPLAYY >>>>" + currMonthName);
            }





            var monthsN = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ];

            var months = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ];


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
            Message.quickReply(senderId, messagetxt, replies);
            Message.typingOff(senderId);
        }
    }

}();