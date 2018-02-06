let beverage = ''
let city = ''
let country = ''
let venue_type = ''
let cuisine = ''
let dish = ''
let venue_title = ''
let venue_chain = ''
let venue_facility = ''
let meal = ''


if ((isDefined(contexts[0].parameters.meal))) {
    if (contexts[0].parameters.meal != "") {
        meal = contexts[0].parameters.meal
        console.log('meal>> ' + meal)
    }
}



if ((isDefined(contexts[0].parameters.venue_facility))) {
    if (contexts[0].parameters.venue_facility != "") {
        venue_facility = contexts[0].parameters.venue_facility
        console.log('venue_facility>> ' + venue_facility)
    }
}


if ((isDefined(contexts[0].parameters.venue_chain))) {
    if (contexts[0].parameters.venue_chain != "") {
        venue_chain = contexts[0].parameters.venue_chain
        console.log('venue_chain>> ' + venue_chain)
    }
}



if ((isDefined(contexts[0].parameters.venue_title))) {
    if (contexts[0].parameters.venue_title != "") {
        venue_title = contexts[0].parameters.venue_title
        console.log('venue_title>> ' + venue_title)
    }
}


if ((isDefined(contexts[0].parameters.dish))) {
    if (contexts[0].parameters.dish != "") {
        dish = contexts[0].parameters.dish
        console.log('dish>> ' + dish)
    }
}


if ((isDefined(contexts[0].parameters.beverage))) {
    if (contexts[0].parameters.beverage != "") {
        beverage = contexts[0].parameters.beverage
        console.log('beverage>> ' + beverage)
    }
}

if ((isDefined(contexts[0].parameters.venue_type))) {
    if (contexts[0].parameters.venue_type != "") {
        venue_type = contexts[0].parameters.venue_type
        console.log('venue_type>> ' + venue_type)
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


if ((isDefined(contexts[0].parameters.cuisine))) {
    if (contexts[0].parameters.cuisine != "") {
        cuisine = contexts[0].parameters.cuisine
        console.log('cuisineV >> ' + cuisine)
    }
}


if (venue_chain != '') {
    venue_title = venue_chain
}

if (dish != '') {
    venue_title = dish
}


let qs = {}
let zomatoQs = []
if (city != '') {
    zomato.getCities(city).then((cityResponse) => {
        console.log('cityResponse' + JSON.stringify(cityResponse))
        let city_id = cityResponse.location_suggestions[0].id

        if (cuisine != '' && venue_type != '') {
            zomatoQs.push(zomato.searchByCityCuisineEstablishment(city_id, venue_type, cuisine, 1).then(qs))
        }

        if (venue_title != '' && venue_type != '') {
            zomatoQs.push(zomato.searchByCityVenueTitleEstablishment(city_id, venue_type, venue_title, 2).then(qs))
        }

        if (venue_title != '' && cuisine != '') {
            zomatoQs.push(zomato.searchByCityVenueTitleCusine(city_id, venue_title, cuisine, 3).then(qs))
        }

        if (venue_type != '') {
            zomatoQs.push(zomato.searchByCityEstablishment(city_id, venue_type, 4).then(qs))
        }

        if (cuisine != '') {
            zomatoQs.push(zomato.searchByCityCuisine(city_id, cuisine, 5).then(qs))
        }

        if (venue_title != '') {
            zomatoQs.push(zomato.searchByCityVenueTitle(city_id, venue_title, 6).then(qs))

        }
        zomatoQs.push(zomato.searchByCity(city_id, 7).then(qs))


        Promise.all(zomatoQs).then(ArrayQs => {
            console.log('zomatoQs ' + JSON.stringify(ArrayQs))
            zomato.selectQsByPriority(ArrayQs).then((qs) => {
                console.log('priority ' + qs.priority)
                delete qs.priority;

                zomato.starRenderFBTemplate(sender, qs)

            })

        });



    })

} else { //busquedas por cordenadas...
    console.log('Se activa busqueda por coordenadas...')
    user_queries.getUserByFbId(sender).then((foundUser) => {
        if (isDefined(foundUser)) {
            let lat = foundUser.location.coordinates[0];
            let lon = foundUser.location.coordinates[1];
            if (isDefined(lat) && isDefined(lon)) {

                if (cuisine != '' && venue_type != '') {
                    zomatoQs.push(zomato.searchByCuisineEstablishmentAndCoordinates(lat, lon, cuisine, venue_type, 1).then(qs))
                }

                if (venue_title != '' && venue_type != '') {
                    zomatoQs.push(zomato.searchByVenueTitleEstablishmentAndCoordinates(lat, lon, venue_type, venue_title, 2).then(qs))
                }

                if (venue_title != '' && cuisine != '') {
                    zomatoQs.push(zomato.searchByVenueTitleCusineAndCoordinates(lat, lon, venue_title, cuisine, 3).then(qs))
                }

                if (venue_type != '') {
                    zomatoQs.push(zomato.searchByEstablismentAndCoordinates(lat, lon, venue_type, 4).then(qs))
                }

                if (cuisine != '') {
                    zomatoQs.push(zomato.searchByCuisineAndCoordinates(cuisine, lat, lon, 5).then(qs))
                }

                if (venue_title != '') {
                    zomatoQs.push(zomato.searchByVenueTitleAndCoordinates(venue_title, lat, lon, 6).then(qs))
                }


                zomatoQs.push(zomato.searchByCoordinates(lat, lon, 7).then(qs))





                Promise.all(zomatoQs).then(ArrayQs => {
                    console.log('zomatoQs ' + JSON.stringify(ArrayQs))
                    zomato.selectQsByPriority(ArrayQs).then((qs) => {
                        console.log('priority ' + qs.priority)
                        delete qs.priority;

                        zomato.starRenderFBTemplate(sender, qs)

                    })

                });




            } else { //pedir coordenadas....
                user_queries.createUpdateUserDatas(sender, 'find_venue_to_eat').then(() => {
                    Message.getLocation(sender, 'What location would you like to eat at?');
                })

            }
        }
    })






}//aki