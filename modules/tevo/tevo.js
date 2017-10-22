var TevoClient = require('ticketevolution-node');
var tevo_categories = require('./tevo_categories')

var tevoClient = new TevoClient({
    apiToken: '9853014b1eff3bbf8cb205f60ab1b177',
    apiSecretKey: 'UjFcR/nPkgiFchBYjLOMTAeDRCliwyhU8mlaQni2'
});


var searchCategoriesByParentId = (parent_id) => {
    return new Promise((res, rej) => {
        let urlApiTevo = 'https://api.ticketevolution.com/v9/categories?parent_id=' + parent_id
        console.log('>>>>>>>>>>>>>>>>>url tevo' + urlApiTevo);
        if (tevoClient) {
            tevoClient.getJSON(urlApiTevo).then((json) => {
                res(json);
            });
        }
    });
} //comic con convención de los comics...


function searchCategoriesParents() {
    let categoriesArray = [];
    let parentCategories = tevo_categories.parentCategories();
    for (let i = 0; i < parentCategories.length; i++) {
        if (parentCategories[i].Sports) {
            for (let j = 0; j < parentCategories[i].Sports.length; j++) {
                let parent_id = parentCategories[i].Sports[j].id;
                let parent_name = parentCategories[i].Sports[j].name;
                console.log('searchCategoriesByParentId   >>>> PARENT NAME ' + parent_name);

                searchCategoriesByParentId(parentCategories[i].Sports[j].id).then((resultado) => {
                    console.log('searchCategoriesByParentId   >>>> ' + resultado);
                    let categories = resultado.categories;
                    for (let k = 0; k < categories.length; k++) {
                        categoriesArray.push({
                            "id": categories[k].id,
                            "name": categories[k].name
                        });
                    }


                });
                console.log('encima de search')


            }

        } else {
            console.log('searchCategoriesByParentId   >>>> PARENT NAME ' + parentCategories[i].name);

            searchCategoriesByParentId(parentCategories[i].id).then((resultado) => {
                console.log('searchCategoriesByParentId   >>>> ' + resultado);
                let categories = resultado.categories;
                for (let k = 0; k < categories.length; k++) {
                    categoriesArray.push({
                        "id": categories[k].id,
                        "name": categories[k].name
                    });
                }

            });
        }
    }

    console.log('CATEGORIAS LENGTH   >>>> PARENT NAME ' + categoriesArray.length);
}


module.exports = {
    searchCategoriesByParentId,
    searchCategoriesParents

}