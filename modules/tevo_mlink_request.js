

module.exports = function () {
    return {
        start: function (senderId, filtro) {
            var TevoClient = require('ticketevolution-node');
            var Message = require('../bot/messages');
            var tevoClient = new TevoClient({
                apiToken: '9853014b1eff3bbf8cb205f60ab1b177',
                apiSecretKey: 'UjFcR/nPkgiFchBYjLOMTAeDRCliwyhU8mlaQni2'
            });

          
            var  urlApiTevo =   'https://api.ticketevolution.com/v9/ticket_groups/'+ filtro+"?ticket_list=true"


            
            console.log('url api tevo>>>>>>>' +  urlApiTevo);

            if (tevoClient) {

                tevoClient.getJSON(urlApiTevo).then((json) => {
                    Message.sendMessage(senderId, "Obteniendo Eventos:");
                    if(json.error){
                        Message.sendMessage(senderId, json.error);
                    }
                    else{
                        console.log("ESTE ES EL ID DEL EVENTO>>>>>>>>>>>>> "+ json);
                        console.log("ESTE ES EL ID DEL EVENTO>>>>>>>>>>>>> "+  inspeccionar(json));
                    }
                            
           



                }).catch((err) => {
                    console.err(err);
                });
            }
        }
    }
}();



function inspeccionar(obj)
{
  var msg = '';

  for (var property in obj)
  {
    if (typeof obj[property] == 'function')
    {
      var inicio = obj[property].toString().indexOf('function');
      var fin = obj[property].toString().indexOf(')')+1;
      var propertyValue=obj[property].toString().substring(inicio,fin);
      msg +=(typeof obj[property])+' '+property+' : '+propertyValue+' ;\n';
    }
    else if (typeof obj[property] == 'unknown')
    {
      msg += 'unknown '+property+' : unknown ;\n';
    }
    else
    {
      msg +=(typeof obj[property])+' '+property+' : '+obj[property]+' ;\n';
    }
  }
  return msg;
}