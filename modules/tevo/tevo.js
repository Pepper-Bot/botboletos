var TevoClient = require('ticketevolution-node');
var tevo_categories = require('./tevo_categories');
var follow_months = require('../follow_months');
var moment = require('moment');
var categoriesArray_g = [];
var eventsArray_g = [];
//let approved = students.filter(student => student.score >= 11);


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

var searchEventsByCategoryIdAndDate = (category_id, occurs_at_gte, occurs_at_lte) => {
    return new Promise((res, rej) => {
        let urlApiTevo = 'https://api.ticketevolution.com/v9/events?category_id=' + category_id + '&only_with_tickets=all&occurs_at.gte=' + occurs_at_gte + '&occurs_at.lte=' + occurs_at_lte + '&order_by=events.occurs_at'
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




function searchEventsByParentNameSecondStep(categoriesArray, eventsArray, acum) {
    return new Promise(function (resolve, reject) {

        for (let indice = 0; indice < categoriesArray.length; indice++) {
            
            searchEventsByCategoryId(categoriesArray[indice].id).then((resultado) => {
                let events = resultado.events;

                for (let j = 0; j < events.length; j++) {
                    //console.log('events[j] >>>> ' + events[j].name);
                    eventsArray.push({
                        "id": events[j].id,
                        "name": events[j].name,
                        "category_name": events[j].category.name,
                        "occurs_at": new Date(events[j].occurs_at),
                        "performer_name": events[j].performances[0].performer.name,
                        "venue_id": events[j].venue.id
                    });
                    console.log(acum + ' ' + categoriesArray.length);
                    if (acum + 1 == categoriesArray.length) {
                        resolve(eventsArray);
                    }
                }

            }).then( () => {
                acum  = acum +  1;
                


            });

        }

    });
}


Array.prototype.orderByDate = function (property, sortOrder) {
    if (sortOrder != -1 && sortOrder != 1) sortOrder = 1;
    this.sort(function (a, b) {
        var dateA = new Date(a[property]),
            dateB = new Date(b[property]);
        return (dateA - dateB) * sortOrder;
    })
}


function searchEventsByParentName(name, categoriesArray, cuenta) {
    const promise = new Promise(function (resolve, reject) {
        let parentCategories = tevo_categories.searchParentCategoryByName(name);
        if (parentCategories.Sports) {
            for (let j = 0; j < parentCategories.Sports.length; j++) {
                let parent_id = parentCategories.Sports[j].id;
                searchCategoriesByParentId(parent_id).then((resultado) => {
                    let categories = resultado.categories;
                    for (let k = 0; k < categories.length; k++) {
                        // console.log('categories[k].name >>>> ' + categories[k].name);
                        categoriesArray.push({
                            "id": categories[k].id,
                            "name": categories[k].name
                        });

                        if (cuenta + 1 == parentCategories.Sports.length) {
                            console.log('categoriesArray.length >>>' + categoriesArray.length);
                            resolve(categoriesArray);
                        }

                    }

                }).then( () => {
                    cuenta  = cuenta +1;
                     
                });






            }
        } else {
            searchCategoriesByParentId(parentCategories.id).then((resultado) => {
                let categories = resultado.categories;
                for (let k = 0; k < categories.length; k++) {
                    // console.log('categories[k].name >>>> ' + categories[k].name);
                    categoriesArray.push({
                        "id": categories[k].id,
                        "name": categories[k].name
                    });

                    if (k + 1 == categories.length) {
                        console.log('categoriesArray.length >>>' + categoriesArray.length);
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




module.exports = {
    searchCategoriesByParentId,
    searchCategoriesParents,
    searchEventsByParentName,
    searchEventsByCategoryId,
    searchEventsByParentNameSecondStep

}