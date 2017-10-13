'use strict'

var MLinkModel = require('../models/mlink.model');

function saludar(req, res) {
	if (req.params.nombre) {
		var nombre = req.params.nombre;
	} else {
		var nombre = "NN";
	}
	res.status(200).send({
			saludo: "Hola: " + nombre + " desde Pepper Bot!! :) "
		}

	);
}

function getMlink(req, res) {

	var mlinkId = req.params.id;
	MLinkModel.findById(mlinkId, (err, mlink) => {
		if (err) {
			res.status(500).send({
				message: 'Error al devolver el marcador'
			});

		}
		if (!mlink) {
			res.status(404).send({
				message: 'No existen registros en mlinks'
			});
		}
		if (mlink) {
			res.status(200).send({
				mlink
			});

		}
	});

}


function getMlinks(req, res) {

	MLinkModel
		.find({} /*condiciones*/ )
		.sort({
			url: 'asc'
		} /*ordenamiento*/ )
		.exec(
			(err, mlinks) => {
				if (err) {
					res.status(500).send({
						message: 'Error al consultar mlinks!! '
					});

				}
				if (!mlinks) {
					res.status(404).send({
						message: 'No tenemos mlinks!! '

					});
				}
				if (mlinks) {
					res.status(200).send({
						mlinks
					}); /*salida OK*/

				}
			});
}



function getMlinkByMLink(req, res) {
	var _mlink = req.params.mlink;
	MLinkModel
		.find({
			mlink: _mlink
		} /*condiciones*/ )
		.sort({
			url: 'asc'
		} /*ordenamiento*/ )
		.exec(
			(err, mlinks) => {
				if (err) {
					res.status(500).send({
						message: 'Error al consultar mlinks!! '
					});

				}
				if (!mlinks) {
					res.status(404).send({
						message: 'No tenemos mlinks!! '

					});
				}
				if (mlinks) {
					res.status(200).send({
						mlinks
					}); /*salida OK*/

				}
			});
}



function createMlink(req, res) {
	var params = req.body;
	var _mlink = new MLinkModel();

	_mlink.mlink = params.mlink;
	_mlink.id_evento = params.id_evento;


	_mlink.save((err, mlinkStored) => {
		if (err) {
			res.status(500).send({
				message: 'Error al guardar el marcador'

			});
		} else {
			res.status(200).send({
				create: true,
				mlink: mlinkStored
			});
		}

	}); //fin del save

} //fin de createmlink

function updateMlink(req, res) {
	var mlinkId = req.params.id;
	var update = req.body;
	MLinkModel.findByIdAndUpdate(mlinkId, update, (err, mlinkUpdate) => {
		if (err) {
			res.status(500).send({
				message: 'Error al actualizar el marcador'
			});
		} else {
			res.status(200).send({
				actualizado: true,
				mlinkUpdate
			});
		}

	});

}

function deleteMlink(req, res) {
	var mlinkId = req.params.id;
	MLinkModel.findById(mlinkId, (err, mlink) => {
		if (err) {
			res.status(500).send({
				message: 'Error al devolver el marcador'
			});

		}
		if (!mlink) {
			res.status(404).send({
				message: 'No existen registros en mlinks'
			});
		}
		if (mlink) {
			mlink.remove(err => {
				if (err) {
					res.status(200).send({
						delete: true,
						message: "El marcador se ha borrado"
					})

				} else {
					res.status(200).send({
						delete: true,
						message: "El marcador se ha borrado"
					})
				}
			});
		}
	});
}


function searchEventName(req, res) {
	var ticket_group_id = req.params.ticket_group_id;
	var TevoClient = require('ticketevolution-node');

	var tevoClient = new TevoClient({
		apiToken: '9853014b1eff3bbf8cb205f60ab1b177',
		apiSecretKey: 'UjFcR/nPkgiFchBYjLOMTAeDRCliwyhU8mlaQni2'
	});
	var urlApiTevo = 'https://api.ticketevolution.com/v9/ticket_groups/' + ticket_group_id + "?ticket_list=true"
	if (tevoClient) {
		tevoClient.getJSON(urlApiTevo).then((json) => {
			var event_id = json.event.id;
			console.log("ESTE ES EL ID DEL EVENTO>>>>>>>>>>>>> " + event_id);
			if (event_id > 0) {
				console.log('encontré el evento:::::>>>>>>  ' + event_id);
				urlApiTevo = 'https://api.ticketevolution.com/v9/events/' + event_id
				tevoClient.getJSON(urlApiTevo).then((json) => {


					res.status(200).send({
						name: json.name,
						occurs_at: json.occurs_at
					});
				});
			}

		});
	}
}




function searchEventByName(req, res) {
	var name = req.params.name;
	var TevoClient = require('ticketevolution-node');

	var tevoClient = new TevoClient({
		apiToken: '9853014b1eff3bbf8cb205f60ab1b177',
		apiSecretKey: 'UjFcR/nPkgiFchBYjLOMTAeDRCliwyhU8mlaQni2'
	});
//	20.46957,-103.45400
	//var urlApiTevo = 'https://api.ticketevolution.com/v9/events/search?name='+ name +'&page=1&per_page=50&only_with_tickets=all'
	var urlApiTevo = 'https://api.ticketevolution.com/v9/events?lat='+20.46957+'&lon='+-103.45400+'&page=1&per_page=50&only_with_tickets=all'
	console.log('>>>>>>>>>>>>>>>>>url tevo' +urlApiTevo );
	if (tevoClient) {
		tevoClient.getJSON(urlApiTevo).then((json) => {
			res.status(200).send({
				events: json
			});


		});
	}
}





module.exports = {
	saludar,
	getMlink,
	getMlinks,
	createMlink,
	updateMlink,
	deleteMlink,
	getMlinkByMLink,
	searchEventName,
	searchEventByName

}