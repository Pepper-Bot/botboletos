/********************************************************************
 * @module Ticket Evolutions Module.
 * @author Leonardo Jaimes Estévez
 * @version 1
 */

var TevoClient = require('ticketevolution-node');
var tevo_categories = require('./tevo_categories');
var follow_months = require('./follow_months');
var moment = require('moment');
var categoriesArray_g = [];
var eventsArray_g = [];
var catetegorySelected = '';
var processEventURL = 'https://ticketdelivery.herokuapp.com/event/?event_id=';
var Message = require('../../bot/messages');
var arraySort = require('array-sort');
var UserData = require('../../bot/userinfo');
var UserData2 = require('../../schemas/userinfo');



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
        let urlApiTevo = 'https://api.ticketevolution.com/v9/events?category_id=' + category_id + '&only_with_available_tickets=true'
        console.log('>>>>>>>>>>>>>>>>>url tevo' + urlApiTevo);
        if (tevoClient) {
            tevoClient.getJSON(urlApiTevo).then((json) => {
                res(json);
            });
        }
    });
}

var searchEventsByCategoryIdAndLocation = (category_id, lat, lon) => {
    return new Promise((res, rej) => {
        //var urlApiTevo = 'https://api.ticketevolution.com/v9/events?category_id=' + category_id + '&page=1&per_page=50&only_with_tickets=all'
        let urlApiTevo = 'https://api.ticketevolution.com/v9/events?category_id=' + category_id + '&lat=' + lat + '&lon=' + lon + '&only_with_available_tickets=true&within=100'

        if (tevoClient) {
            tevoClient.getJSON(urlApiTevo).then((json) => {
                console.log('>>>>>>>>>>>>>>>>>url tevo' + urlApiTevo);
                res(json);
            }).catch(err => console.log("Error en la function searchEventsByCategoryIdAndLocation  " + err.message));
        }
    });
}


var searchEventsByCategoryIdAndDate = (category_id, occurs_at_gte, occurs_at_lte) => {
    return new Promise((res, rej) => {
        let urlApiTevo = 'https://api.ticketevolution.com/v9/events?category_id=' + category_id + '&only_with_available_tickets=true&occurs_at.gte=' + occurs_at_gte + '&occurs_at.lte=' + occurs_at_lte + '&order_by=events.occurs_at'
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

            var occurs_at = resultEvent[j].occurs_at;


            eventButtons_.push({
                "title": resultEvent[j].name,
                "image_url": resultEvent[j].category_name,
                "subtitle": resultEvent[j].venue_name,
                "occurs_at": occurs_at,
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

var getGoogleImage = (search, matriz = []) => {
    return new Promise((resolve, reject) => {

        var gis = require('g-i-s');
        gis(search, logResults);

        function logResults(error, results) {
            if (error) {
                reject(error);
            } else {
                resolve(results, matriz);
            }
        }

    });
}


var setImagesToEventsTemplate = (senderId, resultEvent, gButtons, counter, position = 0) => {

    return new Promise((resolve, reject) => {


        eventsArray_g = resultEvent_;
        var resultEvent_ = arraySort(resultEvent, 'occurs_at');


        gButtons = resultEvent_;



        if (gButtons.length > 9 * (position - 1)) {
            if ((position * 9) > gButtons.length - 9) {
                position = 0;
                UserData2.findOne({
                    fbId: senderId
                }, {}, {
                    sort: {
                        'sessionStart': -1
                    }
                }, function (err, foundUser) {
                    if (!err) {
                        if (null != foundUser) {
                            foundUser.showMemore.index3 = 0
                            foundUser.save(function (err) {
                                if (!err) {
                                    console.log("index1 en cero");
                                } else {
                                    console.log("error al actualizar el index 0");
                                }
                            });
                        }
                    }

                });
            }

            console.log("position: " + position);
            if (9 * (position + 1) < gButtons.length + 1)
                gButtons.splice(9 * (position + 1), gButtons.length - 9 * (position + 1));
            if (position - 1 >= 0)
                if (9 * (position) < gButtons.length + 1)
                    gButtons.splice(0, 9 * (position));
        }

        gButtons.push({
            "title": "More event times",
            "buttons": [{
                "type": "postback",
                "title": "More event times",
                "payload": "find_my_event_see_more_events_by_cat_loc"
            }]
        });




        for (let z = 0; z < gButtons.length; z++) {
            let search = 'event ' + gButtons[z].title + ' ' + gButtons[z].image_url;
            getGoogleImage(search, gButtons).then((images) => {


                if (z < gButtons.length - 1) {
                    gButtons[z].image_url = images[0].url;
                    var occurs_at = gButtons[z].occurs_at
                    occurs_at = occurs_at.substring(0, occurs_at.length - 4)
                    occurs_at = moment(occurs_at).format('dddd') + ', ' + moment(occurs_at).format('MMMM Do YYYY, h:mm a')

                    gButtons[z].subtitle = gButtons[z].subtitle + ' ' + occurs_at;
                    delete gButtons[z].occurs_at;
                }

                if (z == gButtons.length - 1) {
                    gButtons[z].image_url = 'http://www.ideosyncmedia.org/index_htm_files/196.png'
                }

                console.log(counter + ' ' + gButtons.length)
                if (counter + 1 == gButtons.length) {
                    console.log('image >>' + gButtons[z].image_url)
                    //Message.genericButton(senderId, gButtons);
                    Message.sendMessage(senderId, "Book Events:");
                    var GenericButton = require('../../bot/generic_buttton');
                    GenericButton.genericButtonQuickReplay(senderId, gButtons, "Find something else? ")
                    // GenericButton.genericButtonAndTemplateButtons(senderId, gButtons, "You Can choice other options... ")

                }


            }).then(() => {
                counter = counter + 1;

            });

            console.log(counter + 'FOR ' + gButtons.length)


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
                        "occurs_at": events[j].occurs_at,
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

function searchEventsByParentNameAndLocation(categoriesArray, eventsArray, acum, lat, lon) {
    return new Promise(function (resolve, reject) {
        for (let indice = 0; indice < categoriesArray.length; indice++) {

            searchEventsByCategoryIdAndLocation(categoriesArray[indice].id, lat, lon).then((resultado) => {

                let events = resultado.events;

                for (let j = 0; j < events.length; j++) {
                    console.log('events[j] >>>> ' + events[j].name);
                    eventsArray.push({
                        "id": events[j].id,
                        "name": events[j].name,
                        "category_name": events[j].category.name,
                        "occurs_at": events[j].occurs_at,
                        "performer_id": events[j].performances[0].performer.id,
                        "performer_name": events[j].performances[0].performer.name,
                        "venue_id": events[j].venue.id,
                        "venue_name": events[j].venue.name
                    });

                    if (acum + 1 == categoriesArray.length) {
                        resolve(eventsArray);
                    }
                }

                if (acum + 1 == categoriesArray.length) {
                    if (eventsArray.length === 0) {
                        resolve(eventsArray);
                    }
                }


            }).then(() => {
                acum = acum + 1;



            });

            // if (acum + 1 == categoriesArray.length) {
            //   resolve(eventsArray);
            //}
        }

    });
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

function startByParentsCategories(senderId, text, position) {



    var categoriesArray = [];
    var eventsArray = [];
    var eventsButtons_ = [];
    var gButtons = [];
    var events = [];
    var acum = 0;
    var cuenta = 0;
    var contador = 0;
    var contador2 = 0;


    catetegorySelected = text;
    searchEventsByParentName(text, categoriesArray, cuenta).then(function () {
        searchEventsByParentNameSecondStep(categoriesArray, eventsArray, acum).then(function () {
            //return eventsArray
            convertEventsToEventsTemplate(senderId, eventsArray, eventsButtons_, contador).then(function () {
                // return eventsButtons_
                setImagesToEventsTemplate(senderId, eventsButtons_, gButtons, contador2, position).then(function () {
                    // return gButtons
                });
            });

        });
    });

}

function startByParentsCategoriesAndLocation(senderId, text, lat, lon, position = 0) {

    var categoriesArray = [];
    var eventsArray = [];
    var eventsButtons_ = [];
    var gButtons = [];
    var events = [];
    var acum = 0;
    var cuenta = 0;
    var contador = 0;
    var contador2 = 0;

    catetegorySelected = text;

    UserData2.findOne({
        fbId: senderId
    }, {}, {
        sort: {
            'sessionStart': -1
        }
    }, function (err, foundUser) {
        if (!err) {
            if (null != foundUser) {
                foundUser.showMemore.index3 = foundUser.showMemore.index3 + 1
                position = foundUser.showMemore.index3



                searchEventsByParentName(text, categoriesArray, cuenta).then(function () {
                    searchEventsByParentNameAndLocation(categoriesArray, eventsArray, acum, lat, lon).then(function () {
                        //return eventsArray
                        if (eventsArray.length <= 0) {
                            Message.sendMessage(senderId, "No " + text + " Events Found Near Your Given Location");
                        }
                        for (let i = 0; i < eventsArray.length; i++) {
                            // console.log("El evento " + eventsArray[i].name + " ocurre el: " + moment(eventsArray[i].occurs_at, moment.ISO_8601).format())
                        }
                        convertEventsToEventsTemplate(senderId, eventsArray, eventsButtons_, contador).then(function () {
                            /* for (let i = 0; i < eventsButtons_.length; i++) {
                                 console.log(">>> " + eventsButtons_[i].title + " ocurre el: " + eventsButtons_[i].subtitle);
                             }*/
                            setImagesToEventsTemplate(senderId, eventsButtons_, gButtons, contador2, position).then(function () {
                                /* console.log("gButtons.length >>> " + gButtons.length);
                                 for (let i = 0; i < gButtons.length; i++) {
                                     console.log(">>> " + gButtons[i].title + " imageURL " + gButtons[i].image_url);
                                 }*/
                            });
                        });

                    });
                });


                foundUser.context = ''
                foundUser.save(function (err, userSaved) {
                    if (!err) {
                        console.log("se actualiza el index 1 userSaved.showMemore.index3 " + userSaved.showMemore.index3)

                    } else {
                        console.log("error al actualizar el index 3 ")
                    }
                });
            }
        }
    });






}




module.exports = {
    searchCategoriesByParentId,
    searchCategoriesParents,
    searchEventsByParentName,
    searchEventsByCategoryId,
    searchEventsByParentNameSecondStep,
    convertEventsToEventsTemplate,
    setImagesToEventsTemplate,
    startByParentsCategories,
    startByParentsCategoriesAndLocation


}