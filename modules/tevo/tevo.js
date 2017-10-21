var TevoClient = require('ticketevolution-node');
var tevo_categories = require('./tevo_categories')

var tevoClient = new TevoClient({
    apiToken: '9853014b1eff3bbf8cb205f60ab1b177',
    apiSecretKey: 'UjFcR/nPkgiFchBYjLOMTAeDRCliwyhU8mlaQni2'
});


let searchCategoriesByParentId = (parent_id) => {
    return new Promise((res, rej) => {
        var urlApiTevo = 'https://api.ticketevolution.com/v9/categories?parent_id=' + parent_id
        console.log('>>>>>>>>>>>>>>>>>url tevo' + urlApiTevo);
        if (tevoClient) {
            tevoClient.getJSON(urlApiTevo).then((json) => {
                res(json);
            });
        }
    });
} //comic con convención de los comics...

function cat() {

    var repliesArray = [];
    var parentCategories = tevo_categories.parentCategories();
    var text = '';
    for (var i = 0; i < parentCategories.length; i++) {

        if (parentCategories[i].Sports) {
            for (var j = 0; j < parentCategories[i].Sports; j++)

                let parent_id = parentCategories[i].Sports[j].id;
                 let parent_name = parentCategories[i].Sports[j].name;

                searchCategoriesByParentId(parent_id).then((resultado) => {
                    console.log('searchCategoriesByParentId   >>>> ' + resultado);

                    
                    
                });

        } else {

        }



    }




}


module.exports = {
    searchCategoriesByParentId
}