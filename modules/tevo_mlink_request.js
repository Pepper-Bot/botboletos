


module.exports = function () {
    return {
        start: function (senderId) {
           var TevoClient = require('ticketevolution-node');
           var Message = require('../bot/messages');
            var teClient = new TevoClient({
                apiToken: '9853014b1eff3bbf8cb205f60ab1b177',
                apiSecretKey: 'UjFcR/nPkgiFchBYjLOMTAeDRCliwyhU8mlaQni2'
            });


             if(teClient){
                Message.sendMessage(senderId, "Entramos a TEVO");
            }
        }
    }
}();