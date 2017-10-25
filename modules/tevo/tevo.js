/********************************************************************
 * @module Ticket Evolutions Module.
 * @author Leonardo Jaimes Estévez
 * @version 1
 */

var TevoClient = require('ticketevolution-node');
var tevo_categories = require('./tevo_categories');
var follow_months = require('../follow_months');
var imageCards = require('../imageCards'); // Google images
var moment = require('moment');
var categoriesArray_g = [];
var eventsArray_g = [];
var processEventURL = 'https://ticketdelivery.herokuapp.com/event/?event_id=';
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


var convertEventsToEventsTemplate = (senderId, resultEvent, eventButtons_, contador) => {
    return new Promise((resolve, reject) => {
        for (let j = 0; j < resultEvent.length; j++) {

            let date = resultEvent[j].occurs_at;
            let occurs_at =  follow_months.getDateWithoutZone();
            eventButtons_.push({
                "title": resultEvent[j].name, // +' '+ resultEvent[j].category.name,
                "image_url": resultEvent[j].category_name,
                "subtitle": resultEvent[j].venue_name + " " + occurs_at,
                "default_action": {
                    "type": "web_url",
                    "url": processEventURL + resultEvent[j].id + '&uid=' + senderId + '&venue_id=' + resultEvent[j].venue_id + '&performer_id=' + resultEvent[j].performer_id + '&event_name=' + resultEvent[j].name
                    /*,
                    "messenger_extensions": true,
                    "webview_height_ratio": "tall",
                    "fallback_url": baseURL + resultEvent[j].id + '&uid=' + senderId + '&venue_id=' + resultEvent[j].venue_id + '&performer_id=' + resultEvent[j].performer_id + '&event_name=' + resultEvent[j].name*/
                },
                "buttons": [{
                    "type": "web_url",
                    "url": processEventURL + resultEvent[j].id + '&uid=' + senderId + '&venue_id=' + resultEvent[j].venue_id + '&performer_id=' + resultEvent[j].performer_id + '&event_name=' + resultEvent[j].name,
                    "title": "Book"
                }]
            });
            contador++;
            // console.log(contador + ' ' + resultEvent.length);
            if (contador + 1 == resultEvent.length) {
                resolve(eventButtons_);
            }
        }
    });

}

var getGoogleImage = (search) => {
    return new Promise((resolve, reject) => {

        var gis = require('g-i-s');
        gis(search, logResults);

        function logResults(error, results) {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        }

    });
}

var setImagesToEventsTemplate = (resultEvent, gButtons, counter, next = 0) => {
    gButtons = resultEvent;

    if (gButtons.length >= 10) {


    } else if (counter == 10) {


    }

    return new Promise((resolve, reject) => {
        for (let z = 0, k = gButtons.length; z < k; z++) {
            if (z + 10 * 0 <= 9 + 10 * 0) {
                let search = 'event ' + gButtons[z].title + ' ' + gButtons[z].image_url;
                getGoogleImage(search).then((images) => {
                    if (images) {
                        if (images) {
                            console.log('image >>' + images[0].url)
                            gButtons[z].image_url = images[0].url;
                        }
                    }
                }).then(() => {
                    counter = counter + 1;

                });


                if (counter == 10) {
                    resolve(gButtons);
                }
            }


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
                        "performer_id": events[j].performances[0].performer.id,
                        "performer_name": events[j].performances[0].performer.name,
                        "venue_id": events[j].venue.id,
                        "venue_name": events[j].venue.name
                    });

                    if (acum + 1 == categoriesArray.length) {
                        resolve(eventsArray);
                    }
                }

            }).then(() => {
                acum = acum + 1;



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

                }).then(() => {
                    cuenta = cuenta + 1;

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
    searchEventsByParentNameSecondStep,
    convertEventsToEventsTemplate,
    setImagesToEventsTemplate


}