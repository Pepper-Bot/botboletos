module.exports = function () {

    return {

        send: function (Message, senderId, messagetxt) {
            var moment = require('moment');

             var fechaExamen = moment("2015 05 30", "YYYY MM DD");
            
           console.log(fechaExamen.format("DD MM YYYY"));
            
           //dia de la semana
           console.log("dia de la semana :"+fechaExamen.day());
            
           console.log("mes:"+fechaExamen.month());
            
           console.log("año:"+fechaExamen.year());
            
            var hoy = moment();
            
            var diferencia = fechaExamen.diff(hoy,"days");
            
            console.log("la diferencia en dias es"+diferencia);  


            



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