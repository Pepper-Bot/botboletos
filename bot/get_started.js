 var request = require('request');

 var createPersistentMenu = (req, res) => {
	var requestData =  {
		"persistent_menu": [
		  {
			"locale": "default",
			"composer_input_disabled": false,
		  
			
			"call_to_actions": [
			  {
				"type": "postback",
				"title": "Start again",
				"payload": "Greetings",
				"webview_height_ratio": "compact"
			  }
			]
		  }
		]
	}

	request({
		url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
		qs: {
			access_token: process.env.PAGE_ACCESS_TOKEN,
		},
		json: true,
		body: requestData,
		method: 'POST'
	}, function (error, response, body) {
		if(!error){
			console.log("Respuesta  Configurar Menu  : >>> " + JSON.stringify(response))
		 
		}else{
      console.log('error !!'+ error);
		}
		

	});
}



var deleteAndCreatePersistentMenu = () => {
	var requestData = {
		"fields": [
			"persistent_menu"
		]
	}

	request({
		url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
		qs: {
			access_token: process.env.PAGE_ACCESS_TOKEN,
		},
		json: true,
		body: requestData,
		method: 'DELETE'
	}, function (error, response, body) {
		console.log("Respuesta AL BORRAR Configurar Menu  : >>> " + JSON.stringify(response));
		if (!error) {
			createPersistentMenu(req, res );
		}else{
			console.log('error !!'+ error);
		}

	});
}

 module.exports = {
  deleteAndCreatePersistentMenu
 }