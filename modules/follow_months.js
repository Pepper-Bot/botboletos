module.exports = function () {

    return {

        follow_months: function (howmany) {
            var moment = require('moment');

            var monthsReplays = new Array();
            var currentDate = moment();
            monthsReplays.push(currentDate);
            var followMonth;
            var followMonthEnd;
            for (var i = 1; i <= howmany; i++) {
                followMonth = moment(currentDate).add(1, 'M');
                followMonthEnd = moment(followMonth).endOf('month');

                if (currentDate.date() != followMonth.date() && followMonth.isSame(followMonthEnd.format('YYYY-MM-DD'))) {
                    followMonth = followMonth.add(1, 'd');
                }

                currentDate = followMonth;

                monthsReplays.push(followMonth);
            }


            return monthsReplays;
        }
    }

}();