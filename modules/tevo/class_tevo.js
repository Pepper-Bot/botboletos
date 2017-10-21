'use strict';

var TevoClient = require('ticketevolution-node');
var tevo_categories = require('./tevo_categories')



module.exports = class TicketEvoClient {

    constructor() {
        var tevoClient = new TevoClient({
            apiToken: '9853014b1eff3bbf8cb205f60ab1b177',
            apiSecretKey: 'UjFcR/nPkgiFchBYjLOMTAeDRCliwyhU8mlaQni2'
        });
        this.tevo = tevoClient;
        this.events = [];

    }

    searchCategoriesByParentId = (parent_id) => {
        return new Promise((res, rej) => {
            var urlApiTevo = 'https://api.ticketevolution.com/v9/categories?parent_id=' + parent_id
            console.log('>>>>>>>>>>>>>>>>>url tevo' + urlApiTevo);
            if (this.tevo) {
                this.tevo.getJSON(urlApiTevo).then((json) => {

                    res(json);

                });
            }
        });
    } //comic con convención de los comics...


    cat() {

        var repliesArray = [];
        var parentCategories = tevo_categories.parentCategories();
        var text = '';
        for (var i = 0; i < parentCategories.length; i++) {

            if (parentCategories[i].Sports) {

            } else {

            }



        }
    }

};