return new Promise((resolve, reject) => {
    zomatoClient.getestablishments(qs, function (err, result) {
      if (!err) {
        let establishmentsR = JSON.parse(result);

        let establishments = establishmentsR.establishments

        //console.log('establishments ' + JSON.stringify(establishments))


        //let establecimiento = query('establishment.establishment_name').is(establishment).on(establishmentsR.establishments);
        // let establecimiento = query('establishment.establishment_name').is(establishment).on(establishments);


        establishmentQueries.getestablishmentsForAI().then((establecimientosForAI) => {
          //console.log('establecimientosForAI ' + JSON.stringify(establecimientosForAI))
        })

        establishmentQueries.getestablishmentByName(establishment).then((establecimientoEncontrada) => {
          if (establecimientoEncontrada.length > 0) {
            console.log('establecimiento encontrada... >' + JSON.stringify(establecimientoEncontrada))
            resolve(establecimientoEncontrada)
          } else {
            for (let i = 0; i < establishments.length; i++) {
              establishmentQueries.getestablishmentById(establishments[i].establishment.establishment_id).then((cusinesSalida) => {
                if (cusinesSalida) {
                  if (cusinesSalida.length <= 0) {
                    let v_establishmentschema = new establishmentschema; {
                      v_establishmentschema.name = establishments[i].establishment.establishment_name;
                      v_establishmentschema.id = establishments[i].establishment.establishment_id;
                      v_establishmentschema.value = establishments[i].establishment.establishment_name;
                      v_establishmentschema.synonyms.push(establishments[i].establishment.establishment_name)
                      v_establishmentschema.save()
                    }
                  }
                } else {
                  let v_establishmentschema = new establishmentschema; {
                    v_establishmentschema.name = establishments[i].establishment.establishment_name;
                    v_establishmentschema.id = establishments[i].establishment.establishment_id;
                    v_establishmentschema.value = establishments[i].establishment.establishment_name;
                    v_establishmentschema.synonyms.push(establishments[i].establishment.establishment_name)
                    v_establishmentschema.save()
                  }
                }
              })

              if (i == establishments.length - 1) {
                /*for (let j = 0; j < establishments.length; j++) {
                  if (establishments[j].establishment.establishment_name == establishment) {
                    console.log(establishments[j].establishment.establishment_name)
                    establecimiento.push(establishments[j])
                    console.log('establecimiento ' + JSON.stringify(establecimiento))
                    resolve(establecimiento)
                    break;
                  }*/

                establishmentQueries.getestablishmentByName(establishment).then((establecimientoEncontrada) => {
                  console.log('establecimiento encontrada... >' + JSON.stringify(establecimientoEncontrada))
                  resolve(establecimientoEncontrada)
                })
              }

            }
          }
        })
      }

    });
  });