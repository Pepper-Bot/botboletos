var Message = require('../../bot/messages');
var UserData = require('../../bot/userinfo');
var UserData2 = require('../../schemas/userinfo');
var reqExternas = require('../../bot/requestExternas');

var API_AI_CLIENT_ACCESS_TOKEN = require('../../config/config_vars').API_AI_CLIENT_ACCESS_TOKEN;
var APLICATION_URL_DOMAIN = require('../../config/config_vars').APLICATION_URL_DOMAIN;
var PAGE_ACCESS_TOKEN = require('../../config/config_vars').PAGE_ACCESS_TOKEN;

var FB_APP_SECRET = require('../../config/config_vars').FB_APP_SECRET;

var TevoClient = require('ticketevolution-node');
var only_with = require('../../config/config_vars').only_with;
var tevo = require('../../config/config_vars').tevo;
var tevoCategories = require('../../modules/tevo/tevo');
var fsStrings = require('../../config/funciones_varias');
var categories_queries = require('../../schemas/queries/categories_queries')

var moment = require('moment');
var zomato = require('../../modules/zomato/zomato');

var user_queries = require('../../schemas/queries/user_queries');
var TevoModule = require('../../modules/query_tevo_request');




const tevoClient = new TevoClient({
    apiToken: tevo.API_TOKEN,
    apiSecretKey: tevo.API_SECRET_KEY
});

const sessionIds = new Map();

/**
 * 
 * @param {FaceBook Id} sender 
 * @param {Respuesta de DialogFlow API.AI} response 
 * @param {Action definida en Dialog Flow API.AI} action 
 * @param {Respuesta Final del Intent de Dialog Flow API.AI} responseText 
 * @param {Contextos Definidos en el Intent de Dialog Flow API.AI} contexts 
 * @param {Parametros Definidos en el Intent de Dialog Flow API.AI} parameters 
 * 
 * Función para manejar las respuestas en JSON obtenidas de Dialog Flow API.AI
 */
var handleApiAiAction = (sender, response, action, responseText, contexts, parameters) => {
    console.log('>> handleApiAiAction ' + action);
    switch (action) {

        case "input.welcome":
            {
                Message.sendMessage(sender, responseText);
            }
            break;

        case "smalltalk.agent.acquaintanc":
            {
                Message.sendMessage(sender, responseText);
            }
            break;

        case "smalltalk.agent.age":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.agent.annoying":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.agent.bad":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.agent.answer_my_question":
            {
                Message.sendMessage(sender, responseText);
            }
            break;

        case "smalltalk.agent.be_clever":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.agent.beautiful":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.agent.birth_date":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.agent.boss":
            {
                Message.sendMessage(sender, responseText);
            }
            break;

        case "smalltalk.agent.busy":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.agent.can_you_help":
            {
                Message.sendMessage(sender, responseText);
            }
            break;

        case "smalltalk.agent.chatbot":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.agent.clever":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.agent.crazy":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.agent.fired":
            {
                Message.sendMessage(sender, responseText);
            }
            break;

        case "smalltalk.agent.good":
            {
                Message.sendMessage(sender, responseText);
            }
            break;

        case "smalltalk.agent.happy":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.agent.hobby":
            {
                Message.sendMessage(sender, responseText);
            }
            break;

        case "smalltalk.agent.hungry":
            {
                Message.sendMessage(sender, responseText);
            }
            break;

        case "smalltalk.agent.marry_user":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.agent.my_friend":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.agent.occupation":
            {
                Message.sendMessage(sender, responseText);
            }
            break;

        case "smalltalk.agent.origin":
            {
                Message.sendMessage(sender, responseText);
            }
            break;

        case "smalltalk.agent.origin":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.agent.ready":
            {
                Message.sendMessage(sender, responseText);
            }
            break;

        case "smalltalk.agent.real":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.agent.residence":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.agent.talk_to_me":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.agent.talk_to_me":
            {
                Message.sendMessage(sender, responseText);
            }
            break;

        case "smalltalk.agent.there":
            {
                Message.sendMessage(sender, responseText);
            }
            break;

        case "smalltalk.appraisal.bad":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.appraisal.bad":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.appraisal.good":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.appraisal.thank_you":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.appraisal.welcome":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.appraisal.well_done":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.emotions.wow":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.greetings.bye":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.greetings.goodevening":
            {
                Message.sendMessage(sender, responseText);
            }
            break;

        case "smalltalk.greetings.goodmorning":
            {
                Message.sendMessage(sender, responseText);
            }
            break;

        case "smalltalk.greetings.goodnight":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.greetings.hello":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.greetings.how_are_you":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.greetings.nice_to_meet_you":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.greetings.nice_to_see_you":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.greetings.nice_to_talk_to_you":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.greetings.whatsup":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.user.angry":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.user.back":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.user.busy":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.user.can_not_sleep":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.user.does_not_want_to_talk":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.user.going_to_bed":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.user.good":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.user.happy":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.user.has_birthday":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.user.here":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.user.joking":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.user.likes_agent":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.user.lonely":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.user.looks_like":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.user.loves_agent":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.user.misses_agent":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.user.needs_advice":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.user.sad":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.user.sleepy":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.user.testing_agent":
            {
                Message.sendMessage(sender, responseText);
            }
            break;





        case "smalltalk.user.tired":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.user.waits":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.user.wants_to_talk":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.user.will_be_back":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.confirmation.yes":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "smalltalk.confirmation.no":
            {
                Message.sendMessage(sender, responseText);
            }
            break;




        case "smalltalk.confirmation.cancel":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.dialog.hold_on":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.dialog.hug":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.dialog.i_do_not_care":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.dialog.sorry":
            {
                Message.sendMessage(sender, responseText);
            }
            break;



        case "smalltalk.dialog.what_do_you_mean":
            {
                Message.sendMessage(sender, responseText);
            }
            break;




        case "smalltalk.dialog.wrong":
            {
                Message.sendMessage(sender, responseText);
            }
            break;


        case "events.search":
            {
                console.log(" Action events.search >>> ");
                eventsSearch(sender, response, action, responseText, contexts, parameters)
                break;
            }

        case "events.search.implicit":
            {
                eventsSearchImplicit(sender, response, action, responseText, contexts, parameters)
                break;
            }


        case 'venues.nightlife.search':
            {

                if (isDefined(contexts[0])) {
                    console.log('contexto definido ' + contexts[0].name)
                }

                console.log('action ' + 'venues.nightlife.search')
                if (isDefined(contexts[0]) && contexts[0].name == 'venues-nightlife' && contexts[0].parameters) {
                    console.log('contexto ' + contexts[0].name)
                    zomato.zomatoStartAI(sender, contexts);
                } else {

                    console.log('contexto ' + contexts[0].name)



                }
                break;
            }



        case 'venues.eating_out.search':
            {

                if (isDefined(contexts[0])) {
                    console.log('contexto definido ' + contexts[0].name)
                }

                console.log('action ' + 'venues.eating_out.search')
                if (isDefined(contexts[0]) && contexts[0].name == 'venueseating_outsearch-followup' && contexts[0].parameters) {
                    console.log('contexto ' + contexts[0].name)
                    zomato.zomatoStartAI(sender, contexts);

                }

                break;
            }

        case 'sharsk_tank_event':
            {
                if (isDefined(contexts[0]) && contexts[0].name == 'eventssearch-followup' && contexts[0].parameters) {

                }
                var Shark = require('../../modules/shark_boletos');
                Shark.start(sender);
            }
            break;

        case "take_fb_photo":
            {
                startSuperBowlCheer(sender, 'user_says')
            }
            break;


        case 'input.unknown':
            {
                defaultTevoSearchByUserSaid(sender).then((cantidad) => {
                    if (cantidad == 0) {
                        Message.sendMessage(sender, responseText);
                    }

                })
            }
            break;

        default:
            {
                defaultTevoSearchByUserSaid(sender).then((cantidad) => {
                    if (cantidad == 0) {
                        Message.sendMessage(sender, responseText);
                    }

                })

                break;
            }
            //unhandled action, just send back the text

    }
}


/**
 * 
 * @param {FaceBook Id} sender 
 * @param {Respuesta de DialogFlow API.AI} response 
 * @param {Action definida en Dialog Flow API.AI} action 
 * @param {Respuesta Final del Intent de Dialog Flow API.AI} responseText 
 * @param {Contextos Definidos en el Intent de Dialog Flow API.AI} contexts 
 * @param {Parametros Definidos en el Intent de Dialog Flow API.AI} parameters 
 * 
 * Función donde se procesan las acciones, contextos y parametros con los que se arma 
 * una query que es enviadoa a Ticket Evolution y que termina en elaboración de un Generic Template de Facebook
 * 
 */
var eventsSearch = (sender, response, action, responseText, contexts, parameters) => {
    //console.log("handleApiAiResponse >>> " + JSON.stringify(response));
    //console.log("handleApiAiResponse contexts>>> " + JSON.stringify(contexts));
    let city = ''
    let country = ''
    let artist = ''
    let date_time = ''
    let date_time_original = ''
    let event_title = ''
    let startDate = ''
    let finalDate = ''
    let music_genre = ''
    let event_type = ''
    let team = ''

    if (isDefined(contexts[0]) && contexts[0].name == 'eventssearch-followup' && contexts[0].parameters) {



        if ((isDefined(contexts[0].parameters.team))) {
            if (isDefined(contexts[0].parameters.team != '')) {
                team = contexts[0].parameters.team
                console.log('team>> ' + team)

            }
        }


        if ((isDefined(contexts[0].parameters.event_type))) {
            if (isDefined(contexts[0].parameters.event_type != '')) {
                event_type = contexts[0].parameters.event_type
                console.log('event_type>> ' + event_type)

            }
        }


        if ((isDefined(contexts[0].parameters.music_genre))) {
            if (isDefined(contexts[0].parameters.music_genre != '')) {
                music_genre = contexts[0].parameters.music_genre
                console.log('music_genre>> ' + music_genre)

            }
        }



        if ((isDefined(contexts[0].parameters.location))) {
            if (isDefined(contexts[0].parameters.location.city)) {
                city = contexts[0].parameters.location.city
                console.log('city>> ' + city)
            } else {
                if (isDefined(contexts[0].parameters.location.country)) {
                    country = contexts[0].parameters.location.country
                    console.log('country>> ' + country)
                    city = country
                }
            }

        }

        if ((isDefined(contexts[0].parameters.date_time))) {
            if (contexts[0].parameters.date_time != "") {
                date_time = contexts[0].parameters.date_time


                var cadena = date_time,
                    separador = "/",
                    arregloDeSubCadenas = cadena.split(separador);

                if (isDefined(arregloDeSubCadenas[0])) {

                    startDate = arregloDeSubCadenas[0]

                    if (moment(startDate).isSameOrAfter(moment())) {
                        console.log('Es mayor !!')

                    } else {
                        console.log('La fecha inicial es menor a la actual!!!')
                        startDate = moment()
                    }


                    startDate = moment(startDate, moment.ISO_8601).format()


                    startDate = startDate.substring(0, startDate.length - 6)




                    console.log("startDate>>> " + startDate);


                }

                if (isDefined(arregloDeSubCadenas[1])) {
                    finalDate = arregloDeSubCadenas[1]
                    finalDate = moment(finalDate, moment.ISO_8601).format()
                    finalDate = finalDate.substring(0, finalDate.length - 6)

                    console.log("finalDate>>> " + finalDate);
                }

                if (finalDate == '') {
                    finalDate = moment(startDate, moment.ISO_8601).endOf('day').format();
                    finalDate = finalDate.substring(0, finalDate.length - 6)
                    console.log("finalDate = startDate >>> " + finalDate);
                }




                console.log('date_time>> ' + date_time)

            }

        }

        if ((isDefined(contexts[0].parameters.artist))) {
            if (contexts[0].parameters.artist != "") {
                artist = contexts[0].parameters.artist
                console.log('artist>> ' + artist)
            }
        }

        if ((isDefined(contexts[0].parameters.event_title))) {
            if (contexts[0].parameters.event_title != "") {
                event_title = contexts[0].parameters.event_title
                console.log('event_title>> ' + event_title)
            }
        }
        var urlApiTevo = ''
        var urlsApiTevo = []

        if ('superbowl' == event_title.toLowerCase()) {
            event_title = 'Super Bowl'
        }

        var userPreferences = {
            event_title: event_title,
            city: city,
            artist: artist,
            team: team,
            event_type: event_type,
            music_genre: music_genre
        }



        if (artist != '') {
            event_title = artist
        }

        if (team != '') {
            event_title = team
        }


        if (music_genre != '') {
            event_type = music_genre
        }






        var page = 1;
        var per_page = 9;


        var arrayQueryMessages = []


        if (event_title != '') {
            if (city != '') {
                if (date_time != '') {
                    var queryMessage = {
                        prioridad: 1,
                        searchBy: 'NameAndCityAndDate',
                        query: tevo.API_URL + 'events?q=' + event_title + '&page=' + page + '&per_page=' + per_page + '&city_state=' + city + '&occurs_at.gte=' + startDate + '&occurs_at.lte=' + finalDate + '&' + only_with + '&order_by=events.occurs_at',
                        queryReplace: tevo.API_URL + 'events?q=' + event_title + '&page=' + '{{page}}' + '&per_page=' + '{{per_page}}' + '&city_state=' + city + '&occurs_at.gte=' + startDate + '&occurs_at.lte=' + finalDate + '&' + only_with + '&order_by=events.occurs_at',
                        queryPage: page,
                        queryPerPage: per_page,
                        messageTitle: 'Cool, I looked for "' + event_title + '" ' + city + ' shows.  Book a ticket'
                    }
                    arrayQueryMessages.push(queryMessage)
                }
            }


            if (city != '') {
                var queryMessage = {
                    prioridad: 2,
                    searchBy: 'NameAndCity',
                    query: tevo.API_URL + 'events?q=' + event_title + '&page=' + page + '&per_page=' + per_page + '&city_state=' + city + '&' + only_with + '&order_by=events.occurs_at',
                    queryReplace: tevo.API_URL + 'events?q=' + event_title + '&page=' + '{{page}}' + '&per_page=' + '{{per_page}}' + '&city_state=' + city + '&' + only_with + '&order_by=events.occurs_at',
                    queryPage: page,
                    queryPerPage: per_page,
                    messageTitle: 'Cool, I looked for "' + event_title + '" ' + city + ' shows.  Book a ticket'
                }
                arrayQueryMessages.push(queryMessage)
            }

            if (date_time != '') {
                var queryMessage = {
                    prioridad: 3,
                    searchBy: 'NameAndDate',
                    query: tevo.API_URL + 'events?q=' + event_title + '&page=' + page + '&per_page=' + per_page + '&occurs_at.gte=' + startDate + '&occurs_at.lte=' + finalDate + '&' + only_with + '&order_by=events.occurs_at',
                    queryReplace: tevo.API_URL + 'events?q=' + event_title + '&page=' + '{{page}}' + '&per_page=' + '{{per_page}}' + '&occurs_at.gte=' + startDate + '&occurs_at.lte=' + finalDate + '&' + only_with + '&order_by=events.occurs_at',
                    queryPage: page,
                    queryPerPage: per_page,
                    messageTitle: 'Cool, I looked for "' + event_title + '" at ' + date_time + ' shows.  Book a ticket'
                }
                arrayQueryMessages.push(queryMessage)
            }


            var queryMessage = {
                prioridad: 4,
                searchBy: 'ByName',
                query: tevo.API_URL + 'events?q=' + event_title + '&page=' + page + '&per_page=' + per_page + '&' + only_with + '&order_by=events.occurs_at',
                queryReplace: tevo.API_URL + 'events?q=' + event_title + '&page=' + '{{page}}' + '&per_page=' + '{{per_page}}' + '&' + only_with + '&order_by=events.occurs_at',
                queryPage: page,
                queryPerPage: per_page,
                messageTitle: 'Cool, I looked for "' + event_title + '" shows.  Book a ticket'
            }
            arrayQueryMessages.push(queryMessage)


        } else {

            if (city != '') {
                if (date_time != '') {
                    var queryMessage = {
                        prioridad: 1,
                        searchBy: 'CityAndDate',
                        query: tevo.API_URL + 'events?city_state=' + city + '&page=' + page + '&per_page=' + per_page + '&occurs_at.gte=' + startDate + '&occurs_at.lte=' + finalDate + '&' + only_with + '&order_by=events.occurs_at',
                        queryReplace: tevo.API_URL + 'events?city_state=' + city + '&page=' + '{{page}}' + '&per_page=' + '{{per_page}}' + '&occurs_at.gte=' + startDate + '&occurs_at.lte=' + finalDate + '&' + only_with + '&order_by=events.occurs_at',
                        queryPage: page,
                        queryPerPage: per_page,
                        messageTitle: 'Cool, I looked for ' + city + ' shows.  Book a ticket'
                    }
                    arrayQueryMessages.push(queryMessage)
                }
            }
            if (city != '') {
                var queryMessage = {
                    prioridad: 2,
                    searchBy: 'City',
                    query: tevo.API_URL + 'events?city_state=' + city + '&page=' + page + '&per_page=' + per_page + '&' + only_with + '&order_by=events.occurs_at',
                    queryReplace: tevo.API_URL + 'events?city_state=' + city + '&page=' + '{{page}}' + '&per_page=' + '{{per_page}}' + '&' + only_with + '&order_by=events.occurs_at',
                    queryPage: page,
                    queryPerPage: per_page,
                    messageTitle: 'Cool, I looked for ' + city + ' shows.  Book a ticket'
                }
                arrayQueryMessages.push(queryMessage)
            }
        }


        //var queryTevoCate = tevo.API_URL + 'events?category_id=' + category_id + '&' + only_with + '&occurs_at.gte=' + occurs_at_gte + '&occurs_at.lte=' + occurs_at_lte + '&order_by=events.occurs_at'







        if (responseText === "end.events.search") {
            console.log('responseText === "end.events.search"  arrayQueryMessages.length ' + arrayQueryMessages.length)
            if (arrayQueryMessages.length >= 1) {
                startTevoByQuery(arrayQueryMessages).then((query) => {
                    if (query.query) {
                        console.log("query Tevo >>> " + JSON.stringify(query));
                        TevoModule.start(sender, query.query, 1, query.messageTitle, userPreferences, query);
                    } else {
                        console.log('Not Found Events')
                        find_my_event(sender, 1, '');

                    }

                })
            } else {
                console.log('Opps no tengo coincidencias busco por categorías ahora...')
                if (event_type != '') {
                    categories_queries.getIdCategories(event_type).then((categories) => {
                        if (categories) {
                            if (categories.length >= 1) {
                                if (date_time != '') {
                                    var queryMessage = {
                                        prioridad: 1,
                                        searchBy: 'CategoryAndDate',
                                        query: tevo.API_URL + 'events?category_id=' + categories[0].id + '&page=' + page + '&per_page=' + per_page + '&' + only_with + '&occurs_at.gte=' + occurs_at_gte + '&occurs_at.lte=' + occurs_at_lte + '&order_by=events.occurs_at,events.popularity_score DESC', //
                                        queryReplace: tevo.API_URL + 'events?category_id=' + categories[0].id + '&page=' + '{{page}}' + '&per_page=' + '{{per_page}}' + '&' + only_with + '&occurs_at.gte=' + occurs_at_gte + '&occurs_at.lte=' + occurs_at_lte + '&order_by=events.occurs_at,events.popularity_score DESC',
                                        queryPage: page,
                                        queryPerPage: per_page,
                                        messageTitle: 'Cool, I looked for ' + event_type + ' shows.  Book a ticket'
                                    }
                                    arrayQueryMessages.push(queryMessage)
                                }


                                var queryMessage = {
                                    prioridad: 2,
                                    searchBy: 'Category',
                                    query: tevo.API_URL + 'events?category_id=' + categories[0].id + '&page=' + page + '&per_page=' + per_page + '&' + only_with + '&order_by=events.occurs_at,events.popularity_score DESC',
                                    queryReplace: tevo.API_URL + 'events?category_id=' + categories[0].id + '&page=' + '{{page}}' + '&per_page=' + '{{per_page}}' + '&' + only_with + '&order_by=events.occurs_at,events.popularity_score DESC',
                                    queryPage: page,
                                    queryPerPage: per_page,
                                    messageTitle: 'Cool, I looked for ' + event_type + ' shows.  Book a ticket'
                                }
                                arrayQueryMessages.push(queryMessage)



                                if (arrayQueryMessages.length >= 1) {
                                    startTevoByQuery(arrayQueryMessages).then((query) => {
                                        if (query.query) {
                                            console.log("query Tevo >>> " + JSON.stringify(query));
                                            TevoModule.start(sender, query.query, 1, query.messageTitle, userPreferences, query);
                                        } else {
                                            console.log('Not Found Events')
                                            find_my_event(sender, 1, '');

                                        }

                                    })
                                } else {
                                    console.log('Not Found Events')
                                    find_my_event(sender, 1, '');
                                }


                            } else {
                                console.log('categories.length ' + categories.length)
                                find_my_event(sender, 1, '');
                            }
                        } else {
                            console.log('categories.length ' + categories.length)
                            find_my_event(sender, 1, '');
                        }
                    })
                } else {
                    console.log('no  tengo categorías')

                    find_my_event(sender, 1, '');
                }

            }
        } else {
            console.log('responseText !=== "end.events.search"')
        }

    }


    if (responseText != "end.events.search") {
        Message.sendMessage(sender, responseText);

    }

}

/**
 * 
 * @param {FaceBook Id} sender 
 * @param {Respuesta de DialogFlow API.AI} response 
 * @param {Action definida en Dialog Flow API.AI} action 
 * @param {Respuesta Final del Intent de Dialog Flow API.AI} responseText 
 * @param {Contextos Definidos en el Intent de Dialog Flow API.AI} contexts 
 * @param {Parametros Definidos en el Intent de Dialog Flow API.AI} parameters 
 * 
 * Función donde se procesan las acciones, contextos y parametros de la Acción events.search.implicit con los que se arma 
 * una query que es enviadoa a Ticket Evolution y que termina en elaboración de un Generic Template de Facebook
 * 
 */
var eventsSearchImplicit = (sender, response, action, responseText, contexts, parameters) => {
    console.log('dentro de events.search.implicit')
    let lat = ''
    let lon = ''
    let date_time = ''
    let startDate = ''
    let finalDate = ''
    let arrayQueryMessages = []
    if (isDefined(contexts[0]) && contexts[0].name == 'eventssearch-followup' && contexts[0].parameters) {
        if ((isDefined(contexts[0].parameters.date_time))) {
            if (contexts[0].parameters.date_time != "") {
                date_time = contexts[0].parameters.date_time

                var cadena = date_time,
                    separador = "/",
                    arregloDeSubCadenas = cadena.split(separador);

                if (isDefined(arregloDeSubCadenas[0])) {

                    startDate = arregloDeSubCadenas[0]

                    if (moment(startDate).isSameOrAfter(moment())) {
                        console.log('Es mayor !!')

                    } else {
                        console.log('La fecha inicial es menor a la actual!!!')
                        startDate = moment()
                    }


                    startDate = moment(startDate, moment.ISO_8601).format()


                    startDate = startDate.substring(0, startDate.length - 6)




                    console.log("startDate>>> " + startDate);


                }

                if (isDefined(arregloDeSubCadenas[1])) {
                    finalDate = arregloDeSubCadenas[1]
                    finalDate = moment(finalDate, moment.ISO_8601).format()
                    finalDate = finalDate.substring(0, finalDate.length - 6)

                    console.log("finalDate>>> " + finalDate);
                }

                if (finalDate == '') {
                    finalDate = moment(startDate, moment.ISO_8601).endOf('day').format();
                    finalDate = finalDate.substring(0, finalDate.length - 6)
                    console.log("finalDate = startDate >>> " + finalDate);
                }




                console.log('date_time>> ' + date_time)

            }

        }

        if (responseText === "end.events.search") {
            console.log('respondiendo en events.search.implicit')
            UserData2.findOne({
                fbId: sender
            }, {}, {
                sort: {
                    'sessionStart': -1
                }
            }, function (err, foundUser) {
                //--
                if (!err) {
                    if (foundUser !== null) {

                        lat = foundUser.location.coordinates[0];
                        lon = foundUser.location.coordinates[1];
                        // startTevoModuleByLocation(senderId, lat, lon);
                        //foundUser.context = ''

                        console.log('lat ' + lat + ' lon ' + lon)

                        if (isDefined(lat) && isDefined(lon)) {
                            if (lat != '' && lon != '') {
                                if (date_time != '') {
                                    var queryMessage = {
                                        prioridad: 1,
                                        searchBy: 'LocationAndDate',
                                        query: tevo.API_URL + 'events?order_by=events.occurs_at,events.popularity_score DESC&lat=' + lat + '&lon=' + lon + '&page=1&per_page=9&' + only_with + '&within=100' + '&occurs_at.gte=' + startDate + '&occurs_at.lte=' + finalDate,
                                        queryReplace: tevo.API_URL + 'events?order_by=events.occurs_at,events.popularity_score DESC&lat=' + lat + '&lon=' + lon + '&page={{page}}&per_page={{per_page}}&' + only_with + '&within=100' + '&occurs_at.gte=' + startDate + '&occurs_at.lte=' + finalDate,
                                        queryPage: page,
                                        queryPerPage: per_page,
                                        messageTitle: 'Cool, I found events in your location.  Book a ticket'
                                    }
                                    arrayQueryMessages.push(queryMessage)



                                    startTevoByQuery(arrayQueryMessages).then((query) => {
                                        if (query.query) {
                                            console.log("query Tevo >>> " + JSON.stringify(query));
                                            TevoModule.start(sender, query.query, 1, query.messageTitle);
                                        } else {
                                            console.log('Not Found Events')
                                            find_my_event(sender, 1, '');

                                        }

                                    })


                                } else {

                                    let page = 1
                                    let per_page = 9

                                    var query = {
                                        prioridad: 1,
                                        searchBy: 'Location',
                                        query: tevo.API_URL + 'events?order_by=events.occurs_at,events.popularity_score DESC&lat=' + lat + '&lon=' + lon + '&page=' + page + '&per_page=' + per_page + '&' + only_with + '&within=100',
                                        queryReplace: tevo.API_URL + 'events?order_by=events.occurs_at,events.popularity_score DESC&lat=' + lat + '&lon=' + lon + '&page={{page}}&per_page={{per_page}}&' + only_with + '&within=100',
                                        queryPage: page,
                                        queryPerPage: per_page,
                                        messageTitle: 'Cool, I found events in your location.  Book a ticket'
                                    }


                                    var userPreferences = {
                                        event_title: '',
                                        city: '',
                                        artist: '',
                                        team: '',
                                        event_type: '',
                                        music_genre: ''
                                    }

                                    tevoByQuery(sender, query, userPreferences).then((cantidad) => {
                                        if (cantidad == 0) {
                                            var ticketMaster = require('../../../botboletos/modules/tevo/ticket_master_request');
                                            ticketMaster.get(Message, sender, lat, lon);
                                        }
                                    })


                                }
                            } else {
                                console.log('localización  vacía events.search.implicit ')

                                Message.markSeen(sender);
                                Message.getLocation(sender, 'What location would you like to catch show?');
                                Message.typingOn(sender);
                                //saveUserSelection(sender, 'Events');

                                user_queries.createUpdateUserDatas(sender, '-', '', {}, '', '', '', 0, 0, '', '', '', '', '', '', '', 'Events')




                            }
                        } else {
                            console.log('no está definida la localización del usario events.search.implicit ')

                            Message.markSeen(sender);
                            Message.getLocation(sender, 'What location would you like to catch show?');
                            Message.typingOn(sender);
                            //saveUserSelection(sender, 'Events');

                            user_queries.createUpdateUserDatas(sender, '-', '', {}, '', '', '', 0, 0, '', '', '', '', '', '', '', 'Events')


                        }
                    } else {
                        console.log('no encontré  el  usario events.search.implicit ')
                    }
                } else {
                    console.log('error en la busqueda  events.search.implicit')
                }
            })
        }
    }

    if (responseText != "end.events.search") {
        Message.sendMessage(sender, responseText);

    }
}

function isDefined(obj) {
    if (typeof obj == 'undefined') {
        return false;
    }

    if (!obj) {
        return false;
    }

    return obj != null;
}



/**
 * 
 * @param {FaceBook Id} senderId 
 * @param {Respuesta de DialogFlow API.AI} hi 
 * @param {Action definida en Dialog Flow API.AI} action 
 * @param {Respuesta Final del Intent de Dialog Flow API.AI} event_name 
 * 
 * Función que se lanza cuando no se encuentran eventos y se le muestra al usuario con 
 * quick replays las opciones de busqueda de eventos que posee Pepper Bot
 * 
 */
function find_my_event(senderId, hi = 0, event_name = '') {
    user_queries.createUpdateUserDatas(senderId, '-').then((foundUser) => {
        let name = foundUser.firstName
        var greeting = "Hi " + name;
        var messagetxt = greeting + ", you can search events by:";
        if (hi == 1) {
            messagetxt = 'I didn’t find any of that. ' + name + ", you can search events by:";
            greeting = name;
        }

        var SearchQuickReply = require('../../modules/tevo/search_init_quick_replay');
        SearchQuickReply.send(Message, senderId, messagetxt);

    })
}



 
/**
 * 
 * @param {FaceBook Id} sender 
 * @param {Objeto con  las siguientes propiedades: searchBy, queryReplace, queryPage, queryPerPage y messageTitle } query 
 * @param {Objeto con las preferencias de usuario event_title, city, artist, team, event_type, y music_genre   } userPreferences 
 * 
 * Función  que se lanza cuando no se encuentran eventos y se le muestra al usuario con 
 * quick replays las opciones de busqueda de eventos que posee Pepper Bot
 * 
 */
var tevoByQuery = (sender, query = {}, userPreferences = {}) => {
    return new Promise((resolve, reject) => {
        tevoClient.getJSON(query.query).then((json) => {
            if (json.error) {
                //console.log('Error al ejecutar la tevo query ' + arrayQueryMessages[i].query + 'err.message: ' + json.error);
                resolve(0)
            } else {
                if (json.events.length > 0) {
                    console.log("query Tevo >>> " + JSON.stringify(query));
                    TevoModule.start(sender, query.query, 1, query.messageTitle, userPreferences, query);
                    resolve(json.events.length)
                } else {

                    console.log('definitivamente no encontré nada!!')
                    //Message.sendMessage(sender, 'What was that?');
                    resolve(0)
                }

            }
        }).catch((error) => {
            console.log('Error en la consulta!')
            resolve(0)
        })
    })
}

/**
 * 
 * @param {FaceBook Id} sender 
 * Función  para realizar una busqueda por lo ultimo que le escribió el usuario al bot 
 * 
 */
var defaultTevoSearchByUserSaid = (sender) => {
    return new Promise((resolve, reject) => {
        var page = 1;
        var per_page = 9;


        var arrayQueryMessages = []
        var userPreferences = {
            event_title: '',
            city: '',
            artist: '',
            team: '',
            event_type: '',
            music_genre: ''
        }
        UserData2.findOne({
            fbId: sender
        }, {}, {
            sort: {
                'sessionEnd': -1
            }
        }, function (err, foundUser) {
            if (foundUser) {
                let userSays = foundUser.userSays[foundUser.userSays.length - 1]
                if (userSays) {
                    if (userSays.typed) {

                        var query = {
                            prioridad: 4,
                            searchBy: 'ByName',
                            query: tevo.API_URL + 'events?q=' + userSays.typed + '&page=' + page + '&per_page=' + per_page + '&' + only_with + '&order_by=events.occurs_at',
                            queryReplace: tevo.API_URL + 'events?q=' + userSays.typed + '&page=' + '{{page}}' + '&per_page=' + '{{per_page}}' + '&' + only_with + '&order_by=events.occurs_at',
                            queryPage: page,
                            queryPerPage: per_page,
                            messageTitle: 'Cool, I looked for "' + userSays.typed + '" shows.  Book a ticket'
                        }


                        tevoClient.getJSON(query.query).then((json) => {
                            if (json.error) {
                                //console.log('Error al ejecutar la tevo query ' + arrayQueryMessages[i].query + 'err.message: ' + json.error);
                                resolve(0)
                            } else {
                                if (json.events.length > 0) {
                                    console.log("query Tevo >>> " + JSON.stringify(query));
                                    TevoModule.start(sender, query.query, 1, query.messageTitle, userPreferences, query);
                                    resolve(json.events.length)
                                } else {

                                    console.log('definitivamente no encontré nada!!')
                                    //Message.sendMessage(sender, 'What was that?');
                                    resolve(0)
                                }

                            }
                        }).catch((error) => {
                            console.log('Error en la consulta!')
                            // 
                            resolve(0)

                        })
                    } else {
                        console.log('no tengo guardado lo ultimo que escribió el usuario')
                        //
                        resolve(0)
                    }
                }

            } else {
                console.log('user no found !!!! consultado by fbId en  ')
                // 
                resolve(0)
            }
        })
    })

}


/**
 * 
 * @param {Matriz que se recibe las posibles consultas que pueden generar resultado } arrayQueryMessages 
 * Función  para escoger  la consulta que por orden de prioridad debe ser ejecutada
 * 
 */
var startTevoByQuery = (arrayQueryMessages) => {
    return new Promise((resolve, reject) => {

        for (let i = 0; i < arrayQueryMessages.length; i++) {
            tevoClient.getJSON(arrayQueryMessages[i].query).then((json) => {
                let salir = false;
                if (json.error) {
                    //console.log('Error al ejecutar la tevo query ' + arrayQueryMessages[i].query + 'err.message: ' + json.error);

                } else {
                    console.log('i > ' + i + ' ' + arrayQueryMessages[i].searchBy + ' ' + arrayQueryMessages[i].query)
                    if (json.events.length > 0) {
                        resolve(arrayQueryMessages[i])
                        salir = true;
                    }
                }

                if (salir == false && (i == arrayQueryMessages.length - 1)) {
                    resolve({})
                }

            }).catch((err) => {
                console.log("Error al ejecutar la tevo query  " + arrayQueryMessages[i].query + 'err.message: ' + err.message);
            })

        }
    })
}

/**
 * 
 * @param {Facebook Id } senderId 
 * @param {ref del mlink} referral 
 * Función para mostrar como se toma una foto para el superBowl
 * 
 */
var startSuperBowlCheer = (senderId, referral) => {
    var superBowlCheerModule = require('../../modules/tevo/super_bowl/super_bowl_cheer.js')
    superBowlCheerModule.startSuperBowl(senderId, referral)
}

module.exports = {
    handleApiAiAction,
    tevoByQuery
}