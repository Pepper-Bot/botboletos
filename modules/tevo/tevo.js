var TevoClient = require('ticketevolution-node');
var tevo_categories = require('./tevo_categories');


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


var searchEventsByCategoryId = (category_id) => {
    return new Promise((res, rej) => {
        //var urlApiTevo = 'https://api.ticketevolution.com/v9/events?category_id=' + category_id + '&page=1&per_page=50&only_with_tickets=all'
        let urlApiTevo = 'https://api.ticketevolution.com/v9/events?category_id=' + category_id + '&only_with_tickets=all'
        console.log('>>>>>>>>>>>>>>>>>url tevo' + urlApiTevo);
        if (tevoClient) {
            tevoClient.getJSON(urlApiTevo).then((json) => {
                res(json);
            });
        }
    });
}






function addToArray(data, array) {
    const promise = new Promise(function (resolve, reject) {


        if (!array) {
            reject(new Error('No existe un array'))
        }
    });

}




function searchEventsByParentNameSecondStep(name, categoriesArray, eventsArray) {
    const promise = new Promise(function (resolve, reject) {
        searchEventsByParentName(name, categoriesArray).then(function () {
            for (let i = 0; i < categoriesArray.length; i++) {
                searchEventsByCategoryId(categoriesArray[i].id).then((resultado) => {
                    let events = resultado.events;
                    for (let j = 0; j < events.length; i++) {
                        console.log('events[j] >>>> ' + events[j].name);


                    }

                });
            }

        });

    });
    return promise;
}




function searchEventsByParentName(name, categoriesArray) {
    const promise = new Promise(function (resolve, reject) {
        var parentCategories = tevo_categories.searchParentCategoryByName(name);
        if (parentCategories.Sports) {
            for (let j = 0; j < parentCategories.Sports.length; j++) {
                let parent_id = parentCategories.Sports[j].id;
                searchCategoriesByParentId(parent_id).then((resultado) => {
                    let categories = resultado.categories;
                    for (let k = 0; k < categories.length; k++) {
                        console.log('categories[k].name >>>> ' + categories[k].name);
                        categoriesArray.push({
                            "id": categories[k].id,
                            "name": categories[k].name
                        });

                    }
                });

                if (j + 1 == parentCategories.Sports.length) {
                    resolve(categoriesArray);
                }
            }
        } else {
            searchCategoriesByParentId(parentCategories.id).then((resultado) => {
                let categories = resultado.categories;
                for (let k = 0; k < categories.length; k++) {
                    console.log('categories[k].name >>>> ' + categories[k].name);
                    categoriesArray.push({
                        "id": categories[k].id,
                        "name": categories[k].name
                    });

                    if (k + 1 == categories.length) {
                        resolve(categoriesArray);
                    }

                }

            });

        }
    });


    return promise

}




function searchCategoriesParents() {
    let categoriesArray = [];
    let parentCategories = tevo_categories.getParentCategories();

    for (let i = 0; i < parentCategories.length; i++) {
        if (parentCategories[i].Sports) {
            for (let j = 0; j < parentCategories[i].Sports.length; j++) {
                let parent_id = parentCategories[i].Sports[j].id;
                searchCategoriesByParentId(parent_id).then((resultado) => {
                    let categories = resultado.categories;
                    for (let k = 0; k < categories.length; k++) {
                        console.log('categories[k].name >>>> ' + categories[k].name);
                        categoriesArray.push({
                            "id": categories[k].id,
                            "name": categories[k].name
                        });

                    }
                });


            }
        } else {
            searchCategoriesByParentId(parentCategories[i].id).then((resultado) => {
                let categories = resultado.categories;
                for (let k = 0; k < categories.length; k++) {
                    console.log('categories[k].name >>>> ' + categories[k].name);

                    categoriesArray.push({
                        "id": categories[k].id,
                        "name": categories[k].name
                    });
                }

            });
        }
    }

    console.log('CATEGORIAS LENGTH   >>>> PARENT NAME ' + categoriesArray.length);
    // callback(categoriesArray);



}

function searchCategoriesParents2() {
    /*let categoriesArray = [];
    let parentCategories = tevo_categories.parentCategories();
    for (let i = 0; i < parentCategories.length; i++) {
        if (parentCategories[i].Sports) {
            for (let j = 0; j < parentCategories[i].Sports.length; j++) {
                let parent_id = parentCategories[i].Sports[j].id;
                searchCategoriesByParentId(parent_id).then((resultado) => {
                    let categories = resultado.categories;
                    for (let k = 0; k < categories.length; k++) {
                        console.log('categories[k].name >>>> ' + categories[k].name);
                        categoriesArray.push({
                            "id": categories[k].id,
                            "name": categories[k].name
                        });

                    }
                });


            }
        } else {
            searchCategoriesByParentId(parentCategories[i].id).then((resultado) => {
                let categories = resultado.categories;
                for (let k = 0; k < categories.length; k++) {
                    console.log('categories[k].name >>>> ' + categories[k].name);

                    categoriesArray.push({
                        "id": categories[k].id,
                        "name": categories[k].name
                    });
                }

            });
        }
    }

    console.log('CATEGORIAS LENGTH   >>>> PARENT NAME ' + categoriesArray.length);
    // callback(categoriesArray);

*/

}


module.exports = {
    searchCategoriesByParentId,
    searchCategoriesParents,
    searchEventsByParentName,
    searchEventsByCategoryId,
    searchEventsByParentNameSecondStep

}