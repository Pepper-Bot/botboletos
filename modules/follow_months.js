var moment = require('moment');

function follow_months(howmany) {
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

        monthsReplays.push(currentDate);
    }
    /*for(var i = 0 ; i < monthsReplays.length; i ++){
        console.log('>>>>> MES DE FOLLOW_MONTHS' + moment(monthsReplays[i]).format('MMM YYYY'));

    }*/

    return monthsReplays;
}

function getCurrentDate() {
    var currentDate = moment();
    console.log(" moment().date().toISOString()>>>>>> " + moment( currentDate, moment.ISO_8601).format());
    return moment( currentDate, moment.ISO_8601).format();
}

function getFollowMonth() {
    var currentDate = moment();
    var followMonth = moment(currentDate).add(1, 'M');
    var followMonthEnd = moment(followMonth).endOf('month');

    if (currentDate.date() != followMonth.date() && followMonth.isSame(followMonthEnd.format('YYYY-MM-DD'))) {
        followMonth = followMonth.add(1, 'd');
    }
    console.log(" moment().date().toISOString()>>>>>> " + moment( followMonth, moment.ISO_8601).format());
    return moment( followMonth, moment.ISO_8601).format();
}



module.exports = {
    follow_months,
    getCurrentDate,
    getFollowMonth


}