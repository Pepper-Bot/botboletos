var tevoClient = require("./index").tevoClient;
var tevo = require("./index").tevo;
var only_with = require('../../config/config_vars').only_with;
 

 

var searchEventsByPerformerId = ( performer_id, performer_name) => {
  let page = 0;
  let per_page = 9;
  return new Promise((resolve, reject) => {
    var query = {
      prioridad: 1,
      searchBy: "ByPerformerId",
      query: `${
        tevo.API_URL
      }events?performer_id=${performer_id}&page=${page}&per_page=${per_page}&${only_with}&order_by=events.occurs_at`,
      queryReplace: `${
        tevo.API_URL
      }events?performer_id=${performer_id}&page="{{page}}&per_page={{per_page}}&${only_with}&order_by=events.occurs_at`,
      queryPage: page,
      queryPerPage: per_page,
      messageTitle:
        'Cool, I looked for "' + performer_name + '" shows.  Book a ticket'
    };

    tevoClient
      .getJSON(query.query)
      .then(json => {
        if (json.error) {
          //console.log('Error al ejecutar la tevo query ' + arrayQueryMessages[i].query + 'err.message: ' + json.error);
          resolve(0);
        } else {
          if (json.events.length > 0) {
            console.log("query Tevo >>> " + JSON.stringify(query));

            resolve(json.events.length);
          } else {
            console.log("definitivamente no encontré nada!!");
            //Message.sendMessage(sender, 'What was that?');
            resolve(0);
          }
        }
      })
      .catch(error => {
        console.log("Error en la consulta!");
        //
        resolve(0);
      });
  });
};

 

module.exports = {
    searchEventsByPerformerId
  };

  