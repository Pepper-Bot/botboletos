'use strict'

var FavoritoModel = require('../models/favorito.model');

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

function getFavorito(req, res) {

	var favoritoId = req.params.id;
	FavoritoModel.findById(favoritoId, (err, favorito) => {
		if (err) {
			res.status(500).send({ message: 'Error al devolver el marcador' });

		}
		if (!favorito) {
			res.status(404).send({ message: 'No existen registros en favoritos' });
		}
		if (favorito) {
			res.status(200).send({ favorito });

		}
	});

}


function getFavoritos(req, res) {

	FavoritoModel
		.find(
		{}/*condiciones*/
		)
		.sort(
		{ url: 'asc' }/*ordenamiento*/
		)
		.exec(
		(err, favoritos) => {
			if (err) {
				res.status(500).send({
					message: 'Error al consultar Favoritos!! '
				});

			}
			if (!favoritos) {
				res.status(404).send({
					message: 'No tenemos favoritos!! '

				});
			}
			if (favoritos) {
				res.status(200).send({ favoritos });/*salida OK*/

			}
		});
}


function createFavorito(req, res) {
	var params = req.body;
	var _favorito = new FavoritoModel();
	_favorito.title = params.title;
	_favorito.description = params.description;
	_favorito.url = params.url;

	_favorito.save((err, favoritoStored) => {
		if (err) {
			res.status(500).send({
				message: 'Error al guardar el marcador'

			});
		} else {
			res.status(200).send(
				{
					create: true,
					favorito: favoritoStored
				}
			);
		}

	});//fin del save

}//fin de createFavorito

function updateFavorito(req, res) {
	var favoritoId = req.params.id;
	var update = req.body;
	FavoritoModel.findByIdAndUpdate(favoritoId, update, (err, favoritoUpdate) => {
		if (err) {
			res.status(500).send({ message: 'Error al actualizar el marcador' });
		} else {
			res.status(200).send({ actualizado: true, favoritoUpdate });
		}

	});

}

function deleteFavorito(req, res) {
	var favoritoId = req.params.id;
	FavoritoModel.findById(favoritoId, (err, favorito) => {
		if (err) {
			res.status(500).send({ message: 'Error al devolver el marcador' });

		}
		if (!favorito) {
			res.status(404).send({ message: 'No existen registros en favoritos' });
		}
		if (favorito) {
			favorito.remove(err => {
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
	getFavorito,
	getFavoritos,
	createFavorito,
	updateFavorito,
	deleteFavorito
}