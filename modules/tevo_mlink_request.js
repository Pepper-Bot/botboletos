

module.exports = function () {
    return {
        start: function (senderId, filtro) {
            var TevoClient = require('ticketevolution-node');
            var Message = require('../bot/messages');
            var tevoClient = new TevoClient({
                apiToken: '9853014b1eff3bbf8cb205f60ab1b177',
                apiSecretKey: 'UjFcR/nPkgiFchBYjLOMTAeDRCliwyhU8mlaQni2'
            });

          
            var  urlApiTevo =   'https://api.ticketevolution.com/v9/ticket_groups/'+ filtro

            console.log('url api tevo>>>>>>>' +  urlApiTevo);

            if (tevoClient) {

                tevoClient.getJSON(urlApiTevo).then((json) => {
                    Message.sendMessage(senderId, "Obteniendo Eventos:");
                    if(json.error){
                        Message.sendMessage(senderId, json.error);
                    }
                    else{
                        console.log("ESTE ES EL ID DEL EVENTO>>>>>>>>>>>>> "+   json.ticket_groups[0].event.id);
                    }
                            
           



                }).catch((err) => {
                    console.err(err);
                });
            }
        }
    }
}();