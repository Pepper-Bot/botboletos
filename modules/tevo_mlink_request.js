module.exports = function () {
    return {
        start: function (senderId) {
            var TevoClient = require('ticketevolution-node');
            var Message = require('../bot/messages');
            var tevoClient = new TevoClient({
                apiToken: '9853014b1eff3bbf8cb205f60ab1b177',
                apiSecretKey: 'UjFcR/nPkgiFchBYjLOMTAeDRCliwyhU8mlaQni2'
            });

            if (tevoClient) {
                tevoClient.getJSON('https://api.ticketevolution.com/v9/events').then((json) => {
                    Message.sendMessage(senderId, "Obteniendo Eventos:");
                    console.log('Got events from API.', json.total_entries, json.events);
                }).catch((err) => {
                    console.err(err);
                });
            }
        }
    }
}();