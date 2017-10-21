'use strict';
var TevoClient = require('ticketevolution-node');

module.exports = class TickevoClient {
    constructor() {
        this.tevoClient = new TevoClient({
            apiToken: '9853014b1eff3bbf8cb205f60ab1b177',
            apiSecretKey: 'UjFcR/nPkgiFchBYjLOMTAeDRCliwyhU8mlaQni2'
        });
    }

    searchCategoriesByParentId = (parent_id) => {
        return new Promise((res, rej) => {
            var urlApiTevo = 'https://api.ticketevolution.com/v9/categories?parent_id=' + parent_id
            console.log('>>>>>>>>>>>>>>>>>url tevo' + urlApiTevo);
            if (tevoClient) {
               this.tevoClient.getJSON(urlApiTevo).then((json) => {
                    res(json);
                });
            }
        });
    }

};












function tevoClient() {

    return tevoClient;
}