var TevoClient = require('ticketevolution-node');

function tevoClient() {
    var tevoClient = new TevoClient({
        apiToken: '9853014b1eff3bbf8cb205f60ab1b177',
        apiSecretKey: 'UjFcR/nPkgiFchBYjLOMTAeDRCliwyhU8mlaQni2'
    });
    return tevoClient;
}

function searchCategoriesByParentId(parent_id, resultado) {
    var tevoClient = tevoClient();
    var urlApiTevo = 'https://api.ticketevolution.com/v9/categories?parent_id=' + parent_id
    console.log('>>>>>>>>>>>>>>>>>url tevo' + urlApiTevo);
    if (tevoClient) {
        tevoClient.getJSON(urlApiTevo).then((json) => {
            resultado = json;

        });
    }
}//comic con convención de los comics...

module.exports = {
    searchCategoriesByParentId
}