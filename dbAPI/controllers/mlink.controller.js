'use strict'

var MLinkModel= require('../models/mlink.model');

function saludar(req, res) {
	if (req.params.nombre) {
		var nombre = req.params.nombre;
	}
	else {
		var nombre = "NN";
	}
	res.status(200).send(
		{
			saludo: "Hola: " + nombre + " desde heroku "
		}

	);
}

function getMlink(req, res) {

	var mlinkId = req.params.id;
	MLinkModel.findById(mlinkId, (err, mlink) => {
		if (err) {
			res.status(500).send({ message: 'Error al devolver el marcador' });

		}
		if (!mlink) {
			res.status(404).send({ message: 'No existen registros en mlinks' });
		}
		if (mlink) {
			res.status(200).send({ mlink });

		}
	});

}


function getMlinks(req, res) {

	MLinkModel
		.find(
		{}/*condiciones*/
		)
		.sort(
		{ url: 'asc' }/*ordenamiento*/
		)
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
				res.status(200).send({ mlinks });/*salida OK*/

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
			res.status(200).send(
				{
					create: true,
					mlink: mlinkStored
				}
			);
		}

	});//fin del save

}//fin de createmlink

function updateMlink(req, res) {
	var mlinkId = req.params.id;
	var update = req.body;
	MLinkModel.findByIdAndUpdate(mlinkId, update, (err, mlinkUpdate) => {
		if (err) {
			res.status(500).send({ message: 'Error al actualizar el marcador' });
		} else {
			res.status(200).send({ actualizado: true, mlinkUpdate });
		}

	});

}

function deleteMlink(req, res) {
	var mlinkId = req.params.id;
	MLinkModel.findById(mlinkId, (err, mlink) => {
		if (err) {
			res.status(500).send({ message: 'Error al devolver el marcador' });

		}
		if (!mlink) {
			res.status(404).send({ message: 'No existen registros en mlinks' });
		}
		if (mlink) {
			mlink.remove(err => {
				if (err) {
					res.status(200).send({ delete: true, message: "El marcador se ha borrado" })

				} else {
					res.status(200).send({ delete: true, message: "El marcador se ha borrado" })
				}
			});
		}
	});
}





module.exports = {
	saludar,
	getMlink,
	getMlinks,
	createMlink,
	updateMlink,
	deleteMlink
}