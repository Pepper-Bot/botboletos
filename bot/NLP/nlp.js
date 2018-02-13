function handleApiAiAction(sender, response, action, responseText, contexts, parameters) {
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



            







        case "events.search":
            {
                console.log(" Action events.search >>> ");

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


                break;
            }
        case "events.search.implicit":
            {
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
                                                    query: tevo.API_URL + 'events?order_by=events.occurs_at,events.popularity_score DESC&lat=' + lat + '&lon=' + lon + '&page=1&per_page=50&' + only_with + '&within=100' + '&occurs_at.gte=' + startDate + '&occurs_at.lte=' + finalDate,
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
                                                startTevoModuleByLocation(sender, lat, lon)

                                            }
                                        } else {
                                            console.log('localización  vacía events.search.implicit ')

                                            Message.markSeen(sender);
                                            Message.getLocation(sender, 'What location would you like to catch show?');
                                            Message.typingOn(sender);
                                            saveUserSelection(sender, 'Events');

                                            UserData2.findOne({
                                                fbId: sender
                                            }, {}, {
                                                sort: {
                                                    'sessionStart': -1
                                                }
                                            }, function (err, foundUser) {
                                                foundUser.context = ''
                                                foundUser.save();
                                            });



                                        }
                                    } else {
                                        console.log('no está definida la localización del usario events.search.implicit ')

                                        Message.markSeen(sender);
                                        Message.getLocation(sender, 'What location would you like to catch show?');
                                        Message.typingOn(sender);
                                        saveUserSelection(sender, 'Events');

                                        UserData2.findOne({
                                            fbId: sender
                                        }, {}, {
                                            sort: {
                                                'sessionStart': -1
                                            }
                                        }, function (err, foundUser) {
                                            foundUser.context = ''
                                            foundUser.save();
                                        });


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


                break;
            }


        case 'venues.nightlife.search':
            {
                console.log('action ' + 'venues.nightlife.search')
                if (isDefined(contexts[0]) && contexts[0].name == 'venues-nightlife' && contexts[0].parameters) {
                    console.log('contexto ' + contexts[0].name)
                    zomato.zomatoStartAI(sender, contexts);
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

        case "take_fb_photo":
            {
                startSuperBowlCheer(sender, 'user_says')
            }
            break;

        default:
            {
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

                                var queryMessage = {
                                    prioridad: 4,
                                    searchBy: 'ByName',
                                    query: tevo.API_URL + 'events?q=' + userSays.typed + '&page=' + page + '&per_page=' + per_page + '&' + only_with + '&order_by=events.occurs_at',
                                    queryReplace: tevo.API_URL + 'events?q=' + userSays.typed + '&page=' + '{{page}}' + '&per_page=' + '{{per_page}}' + '&' + only_with + '&order_by=events.occurs_at',
                                    queryPage: page,
                                    queryPerPage: per_page,
                                    messageTitle: 'Cool, I looked for "' + userSays.typed + '" shows.  Book a ticket'
                                }
                                arrayQueryMessages.push(queryMessage)

                                if (arrayQueryMessages.length >= 1) {
                                    startTevoByQuery(arrayQueryMessages).then((query) => {
                                        if (query.query) {
                                            console.log("query Tevo >>> " + JSON.stringify(query));
                                            TevoModule.start(sender, query.query, 1, query.messageTitle, userPreferences, query);
                                        } else {
                                            console.log('Events Not found by usersSays escrita por el user')
                                            Message.sendMessage(sender, responseText);

                                        }

                                    })
                                } else {
                                    console.log('Events Not found by q escrita por el user')
                                    Message.sendMessage(sender, responseText);
                                }


                            } else {
                                console.log('no tengo guardado lo ultimo que escribió el usuario')
                                Message.sendMessage(sender, responseText);
                            }
                        }

                    } else {
                        console.log('user no found !!!! consultado by fbId en  ')
                        Message.sendMessage(sender, responseText);
                    }
                })


                break;
            }
            //unhandled action, just send back the text

    }
}