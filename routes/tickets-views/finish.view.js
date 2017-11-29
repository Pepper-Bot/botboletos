var Message = require('../../bot/messages');
var UserData2 = require('../../schemas/userinfo');
var moment = require('moment');
var Client = require('../../schemas/clients');

var TevoClient = require('ticketevolution-node'); // modulo de Ticket Evolution requests
var tevoClient = new TevoClient({
    apiToken: process.env.API_TOKEN,
    apiSecretKey: process.env.API_SECRET_KEY
});





function finish(req, res, payment) {
    var urlApiTevo = process.env.API_URL; // 'https://api.ticketevolution.com/v9/';
    var searchByEventId = urlApiTevo + '/events/' + req.session.event_id;


    //getOrderData(req, payment);
    tevoClient.getJSON(searchByEventId).then((event) => {
        Client.findOne({
            fbId: req.session.client_id
        }, {}, {
            sort: {
                'sessionStart': -1
            }
        }, function (err, clienteSearch) {
            if (!err) {
                if (clienteSearch) {
                    createOrder(req, payment, event, clienteSearch)
                    sendEmailSenGrid(req, payment, event, clienteSearch);
                }
            }

        });



    });


    var pp_recipient_name = payment.payer.payer_info.shipping_address.recipient_name;
    res.render(
        './layouts/tickets/finish', {
            titulo: "Your tickets are on its way!",
            buyer_name: pp_recipient_name,

        }
    );
}

function createClientTevo(req, payment) {
    var pp_email = payment.payer.payer_info.email;
    var pp_first_name = payment.payer.payer_info.first_name;
    var pp_last_name = payment.payer.payer_info.last_name;

    var pp_recipient_name = payment.payer.payer_info.shipping_address.recipient_name;
    var pp_line1 = payment.payer.payer_info.shipping_address.line1;
    var pp_city = payment.payer.payer_info.shipping_address.city;
    var pp_state = payment.payer.payer_info.shipping_address.state;
    var pp_postal_code = payment.payer.payer_info.shipping_address.postal_code;
    var pp_country_code = payment.payer.payer_info.shipping_address.country_code;


    var ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
    console.log('IP Address:>>>>>' + ip);



    var direccionEnvio = {
        label: 'Shipping',
        region: pp_state,
        country_code: pp_country_code,
        postal_code: pp_postal_code,
        street_address: pp_line1,
        extendend_address: '',
        locality: pp_city
    };

    var dataShip = {
        "ticket_group_id": req.session.groupticket_id,
        "address_id": pp_line1,
        "address_attributes": direccionEnvio
    };

    var client_tevo = {
        "clients": [{
            "name": pp_recipient_name,
            "email_addresses": [{
                "address": pp_email
            }],
            "addresses": [{
                "region": pp_state,
                "country_code": pp_country_code,
                "postal_code": pp_postal_code,
                "street_address": pp_line1,
                "locality": ""
            }],
            "phone_numbers": [{
                "number": ""
            }],
            "office_id": process.env.OFFICE_ID
        }]
    }; //cliente_tevo_fin
    tevoClient.postJSON(process.env.API_URL + 'clients', client_tevo).then((clientTevoSaved) => {
        Client.findOne({
            fbId: req.session.fbId
        }, {}, {
            sort: {
                'sessionStart': -1
            }
        }, function (err, clientFound) {
            if (!err) {
                if (clientFound) {
                    clientFound.addresses.push({
                        "label": "Shipping",
                        "region": pp_state,
                        "country_code": pp_country_code,
                        "postal_code": pp_postal_code,
                        "street_address": pp_line1,
                        "locality": pp_city
                    });
                    clientFound.email_address.push()
                    clientFound.save();
                } else {
                    var ClientData = new Client;
                    ClientData.addresses.push({
                        "label": "Shipping",
                        "region": pp_state,
                        "country_code": pp_country_code,
                        "postal_code": pp_postal_code,
                        "street_address": pp_line1,
                        "locality": pp_city
                    });

                    ClientData.email_address.push(pp_email);

                    ClientData.fbId = req.session.fbId;
                    ClientData.fullName = clientTevoSaved.clients[0].name;
                    ClientData.client_id = clientTevoSaved.clients[0].id;
                    ClientData.email_id = clientTevoSaved.clients[0].email_addresses[0].id;
                    ClientData.phone_id = clientTevoSaved.clients[0].phone_numbers[0].id;


                    ClientData.save();





                }

            }



        });






        var direccionEnvio = {
            label: 'Shipping',
            region: pp_state,
            country_code: pp_country_code,
            postal_code: pp_postal_code,
            street_address: pp_line1,
            extendend_address: '',
            locality: pp_city
        };
        var dataShip = {
            "ticket_group_id": req.session.groupticket_id,
            "address_id": pp_line1,
            "address_attributes": direccionEnvio
        };
        tevoClient.postJSON(process.env.API_URL + 'shipments/suggestion', dataShip).then((json) => {




        });

    });
}



function createOrder(req, payment, event, clienteSearch) {

    //pay pal vars
    var pp_email = payment.payer.payer_info.email;
    var pp_first_name = payment.payer.payer_info.first_name;
    var pp_last_name = payment.payer.payer_info.last_name;

    var pp_recipient_name = payment.payer.payer_info.shipping_address.recipient_name;
    var pp_line1 = payment.payer.payer_info.shipping_address.line1;
    var pp_city = payment.payer.payer_info.shipping_address.city;
    var pp_state = payment.payer.payer_info.shipping_address.state;
    var pp_postal_code = payment.payer.payer_info.shipping_address.postal_code;
    var pp_country_code = payment.payer.payer_info.shipping_address.country_code;


    //Session vars
    /*req.session.event_id = event_id;
    req.session.fbId = fbId;
    req.session.venue_id = venue_id;
    req.session.event_name = event_name;
    req.session.performer_id = performer_id;
    req.session.event_date = event_date;
    req.session.section = section;
    req.session.row = row;
    req.session.quantity = quantity;
    req.session.price = price;
    req.session.format = format;
    req.session.eticket = eticket;
    req.session.groupticket_id = groupticket_id;
    req.session.total = price * quantity;
    
    req.session.ship_price
    req.session.provider 
    req.session.shiping_name  
    req.session.event_date
    req.session.address_id = address_id
    req.session.client_id = client_id
    */

    var ticket_group_id = req.session.groupticket_id;
    var price = req.session.price
    var quantity = req.session.quantity

    var email_address_id = clienteSearch.email_id;
    var billing_address_id = clienteSearch.billing_address_id[billing_address_id.length - 1]; // es una respuesta cuando se guarda el cliente

    var seller_id = process.env.OFFICE_ID
    var client_id = clienteSearch.client_id; // es una respuesta cuando se guarda el cliente
    var created_by_ip_address = ''; // Required for brokerages who have enabled Minfraud
    var instructions = '';
    var shipping = 0.0
    if (res.session.ship_price) {
        var shipping = res.session.ship_price // Se obtine luego de hacer petición de shipping   Additional amount added to the order to be labeled as Shipping Cost
    }

    var amount = (parseFloat(price * quantity + shipping).toFixed(2))
    var type = 'offline'; //modo sugerido por tevo
    

    var service_fee = 0.00;
    var additional_expense = 0.00;
    var tax = 0.00;
    var discount = 0.00;
    var promo_code = '';

    //
    var phone_number_id = clienteSearch.phone_id;
    var address_id = clienteSearch.address_id[address_id.length - 1]; //se obtiene luego de la creacion del cliente
    var ship_to_name = clienteSearch.fullName; // nombre completo del cliente
    var address_attributes_name = clienteSearch.fullName; // nombre completo del cliente
    var street_address = clienteSearch.addresses[0].street_address
    var extendend_address = ''; //está enviado vacío 
    var locality = clienteSearch.addresses[0].locality;
    var region = clienteSearch.addresses[0].region;
    var country_code = clienteSearch.addresses[0].country_code;
    var postal_code = clienteSearch.addresses[0].postal_code;



    var created_by_ip_address = ''
    var shipping_address_name = '';
    var shipping_price = 0.00;

    var format = req.session.format;



    if (format == 'Eticket') {
        var orderData = {
            "orders": [{
                "shipped_items": [{
                    "items": [{
                        "ticket_group_id": ticket_group_id,
                        "price": price,
                        "quantity": quantity,
                    }],
                    "type": "Eticket",
                    "email_address_id": email_address_id
                }],
                "billing_address_id": billing_address_id,
                "payments": [{
                    "type": type,
                    "amount": amount
                }],
                "seller_id": seller_id,
                "client_id": client_id,
                "created_by_ip_address": created_by_ip_address,
                "instructions": instructions,
                "shipping": shipping,
                "service_fee": service_fee,
                "additional_expense": additional_expense,
                "tax": tax,
                "discount": discount,
                "promo_code": promo_code
            }]
        };
    } else {
        var orderData = {
            "orders": [{
                "shipped_items": [{
                    "items": [{
                        "ticket_group_id": ticket_group_id,
                        "price": price,
                        "quantity": quantity,
                    }],
                    "phone_number_id": phone_number_id,
                    "service_type": "LEAST_EXPENSIVE",
                    "type": "FedEx",
                    "address_id": address_id,
                    "ship_to_name": ship_to_name,
                    "address_attributes": {
                        "name": address_attributes_name,
                        "street_address": street_address,
                        "extendend_address": extendend_address,
                        "locality": locality,
                        "region": region,
                        "country_code": country_code,
                        "postal_code": postal_code,
                        "label": "shipping"
                    }

                }],
                "billing_address_id": billing_address_id,
                "payments": [{
                    "type": type,
                    "amount": amount,

                }],
                "seller_id": seller_id,
                "client_id": client_id,
                "created_by_ip_address": created_by_ip_address,
                "instructions": instructions,
                "shipping_address": {
                    "name": shipping_address_name,
                    "street_address": street_address,
                    "extendend_address": req.body.extendend_address,
                    "locality": locality,
                    "region": region,
                    "country_code": country_code,
                    "postal_code": postal_code,
                    "label": "shipping"
                },
                "shipping": shipping_price,
                "service_fee": service_fee,
                "additional_expense": additional_expense,
                "tax": tax,
                "discount": discount,
                "promo_code": promo_code
            }]
        }
    }
    console.log("Orden Construida: >>> "+ JSON.stringify(orderData));
    /* teClient.postJSON(process.env.API_URL + 'orders', orderData).then((json) => {
         if (json.error != undefined) {
             res.send('<b>' + json.error + '</b>');
             res.end();
             return;
         }



     });*/

}


function sendEmailSenGrid(req, payment, event, clienteSearch) {
    //pay pal vars
    var pp_email = payment.payer.payer_info.email;
    var pp_first_name = payment.payer.payer_info.first_name;
    var pp_last_name = payment.payer.payer_info.last_name;
    var pp_recipient_name = payment.payer.payer_info.shipping_address.recipient_name;
    var pp_line1 = payment.payer.payer_info.shipping_address.line1;
    var pp_city = payment.payer.payer_info.shipping_address.city;
    var pp_state = payment.payer.payer_info.shipping_address.state;
    var pp_postal_code = payment.payer.payer_info.shipping_address.postal_code;
    var pp_country_code = payment.payer.payer_info.shipping_address.country_code;


    //event vars
    var venue_name = event.venue.name
    var venue_location = event.venue.location;


    var occurs_at = event.occurs_at;

    occurs_at = occurs_at.substring(0, occurs_at.length - 4)

    var occurs_at_date = moment(occurs_at).format('MMMM Do YYYY')
    console.log('occurs_at  >>>' + occurs_at)

    var nombreCliente = pp_first_name;
    var eventoNombre = req.session.event_name;
    var ciudadEvento = venue_location;
    var fechaEvento = occurs_at;
    var horaEvento = moment(occurs_at).format('h:mm a');
    var cantidadTickets = req.session.quantity;
    var tipoTickets = req.session.format;
    var precio = req.session.price;
    var costoTotal = (parseFloat(req.session.quantity * req.session.price).toFixed(2))
    var ordenNumber = '';
    var fechaOrden = '';
    var clienteId = '';
    var venueEvento = venue_name;
    var format = req.session.format;

    var emailsArray = [];
    var correo = {
        "email": "angelamariel88@gmail.com" //arqmike88@gmail.com
    }
    emailsArray.push(correo);

    var correo = {
        "email": "leo777jaimes@gmail.com"
    }
    emailsArray.push(correo);
    correo = {
        "email": pp_email
    }
    emailsArray.push(correo);

    var agregar = false;
    for (let i = 0; i < emailsArray.length; i++) {
        if (emailsArray[i].correo == clienteSearch.email_address[0].address) {
            agregar = true;
        }
    }
    if (agregar === true) {
        correo = {
            "email": clienteSearch.email_address[0].address
        }
        emailsArray.push(correo);

    }





    var templateHTML =
        '<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"> <head> <!-- NAME: CONTRAST --> <!--[if gte mso 15]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> <![endif]--> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1"> <title>Thank you for Buying Tickets!</title> <style type="text/css">p{margin:10px 0;padding:0;}table{border-collapse:collapse;}h1,h2,h3,h4,h5,h6{display:block;margin:0;padding:0;}img,a img{border:0;height:auto;outline:none;text-decoration:none;}body,#bodyTable,#bodyCell{height:100%;margin:0;padding:0;width:100%;}.mcnPreviewText{display:none !important;}#outlook a{padding:0;}img{-ms-interpolation-mode:bicubic;}table{mso-table-lspace:0pt;mso-table-rspace:0pt;}.ReadMsgBody{width:100%;}.ExternalClass{width:100%;}p,a,li,td,blockquote{mso-line-height-rule:exactly;}a[href^=tel],a[href^=sms]{color:inherit;cursor:default;text-decoration:none;}p,a,li,td,body,table,blockquote{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;}.ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{line-height:100%;}a[x-apple-data-detectors]{color:inherit !important;text-decoration:none !important;font-size:inherit !important;font-family:inherit !important;font-weight:inherit !important;line-height:inherit !important;}a.mcnButton{display:block;}.mcnImage{vertical-align:bottom;}.mcnTextContent{word-break:break-word;}.mcnTextContent img{height:auto !important;}.mcnDividerBlock{table-layout:fixed !important;}/*@tab Page@section background style@tip Set the background color and top border for your email. You may want to choose colors that match your companys branding.*/body,#bodyTable{/*@editable*/background-color:#f5f0f0;}/*@tab Page@section background style@tip Set the background color and top border for your email. You may want to choose colors that match your companys branding.*/#bodyCell{/*@editable*/border-top:0;}/*@tab Page@section email border@tip Set the border for your email.*/#templateContainer{/*@editable*/border:0;}/*@tab Page@section heading 1@tip Set the styling for all first-level headings in your emails. These should be the largest of your headings.@style heading 1*/h1{/*@editable*/color:#000000 !important;/*@editable*/font-family:Helvetica;/*@editable*/font-size:12px;/*@editable*/font-style:normal;/*@editable*/font-weight:bold;/*@editable*/line-height:125%;/*@editable*/letter-spacing:-1px;/*@editable*/text-align:left;}/*@tab Page@section heading 2@tip Set the styling for all second-level headings in your emails.@style heading 2*/h2{/*@editable*/color:#000000 !important;/*@editable*/font-family:Helvetica;/*@editable*/font-size:20px;/*@editable*/font-style:normal;/*@editable*/font-weight:bold;/*@editable*/line-height:125%;/*@editable*/letter-spacing:-.75px;/*@editable*/text-align:left;}/*@tab Page@section heading 3@tip Set the styling for all third-level headings in your emails.@style heading 3*/h3{/*@editable*/color:#000000 !important;/*@editable*/font-family:Helvetica;/*@editable*/font-size:16px;/*@editable*/font-style:normal;/*@editable*/font-weight:bold;/*@editable*/line-height:125%;/*@editable*/letter-spacing:-.5px;/*@editable*/text-align:left;}/*@tab Page@section heading 4@tip Set the styling for all fourth-level headings in your emails. These should be the smallest of your headings.@style heading 4*/h4{/*@editable*/color:#000000 !important;/*@editable*/font-family:Helvetica;/*@editable*/font-size:13px;/*@editable*/font-style:normal;/*@editable*/font-weight:bold;/*@editable*/line-height:125%;/*@editable*/letter-spacing:normal;/*@editable*/text-align:left;}/*@tab Preheader@section preheader style@tip Set the background color and borders for your emails preheader area.*/#templatePreheader{/*@editable*/background-color:#000000;/*@editable*/border-top:0;/*@editable*/border-bottom:0;}/*@tab Preheader@section preheader text@tip Set the styling for your emails preheader text. Choose a size and color that is easy to read.*/.preheaderContainer .mcnTextContent,.preheaderContainer .mcnTextContent p{/*@editable*/color:#FFFFFF;/*@editable*/font-family:Helvetica;/*@editable*/font-size:9px;/*@editable*/line-height:125%;/*@editable*/text-align:left;}/*@tab Preheader@section preheader link@tip Set the styling for your emails header links. Choose a color that helps them stand out from your text.*/.preheaderContainer .mcnTextContent a{/*@editable*/color:#C52E26;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}/*@tab Header@section header style@tip Set the background color and borders for your emails header area.*/#templateHeader{/*@editable*/background-color:#FFFFFF;/*@editable*/border-top:0;/*@editable*/border-bottom:0;}/*@tab Header@section header text@tip Set the styling for your emails header text. Choose a size and color that is easy to read.*/.headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:13px;/*@editable*/line-height:150%;/*@editable*/text-align:left;}/*@tab Header@section header link@tip Set the styling for your emails header links. Choose a color that helps them stand out from your text.*/.headerContainer .mcnTextContent a{/*@editable*/color:#C52E26;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}/*@tab Body@section body style@tip Set the background color and borders for your emails body area.*/#templateBody{/*@editable*/background-color:#FFFFFF;/*@editable*/border-top:0;/*@editable*/border-bottom:0;}/*@tab Body@section body text@tip Set the styling for your emails body text. Choose a size and color that is easy to read.*/.bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:13px;/*@editable*/line-height:150%;/*@editable*/text-align:left;}/*@tab Body@section body link@tip Set the styling for your emails body links. Choose a color that helps them stand out from your text.*/.bodyContainer .mcnTextContent a{/*@editable*/color:#C52E26;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}/*@tab Columns@section column style@tip Set the background color and borders for your emails columns area.*/#templateColumns{/*@editable*/background-color:#FFFFFF;/*@editable*/border-top:0;/*@editable*/border-bottom:0;}/*@tab Columns@section left column text@tip Set the styling for your emails left column text. Choose a size and color that is easy to read.*/.leftColumnContainer .mcnTextContent,.leftColumnContainer .mcnTextContent p{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:14px;/*@editable*/line-height:150%;/*@editable*/text-align:left;}/*@tab Columns@section left column link@tip Set the styling for your emails left column links. Choose a color that helps them stand out from your text.*/.leftColumnContainer .mcnTextContent a{/*@editable*/color:#C52E26;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}/*@tab Columns@section right column text@tip Set the styling for your emails right column text. Choose a size and color that is easy to read.*/.rightColumnContainer .mcnTextContent,.rightColumnContainer .mcnTextContent p{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:14px;/*@editable*/line-height:150%;/*@editable*/text-align:left;}/*@tab Columns@section right column link@tip Set the styling for your emails right column links. Choose a color that helps them stand out from your text.*/.rightColumnContainer .mcnTextContent a{/*@editable*/color:#C52E26;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}/*@tab Footer@section footer style@tip Set the background color and borders for your emails footer area.*/#templateFooter{/*@editable*/background-color:#f5f0f0;/*@editable*/border-top:0;/*@editable*/border-bottom:0;}/*@tab Footer@section footer text@tip Set the styling for your emails footer text. Choose a size and color that is easy to read.*/.footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{/*@editable*/color:#CCCCCC;/*@editable*/font-family:Helvetica;/*@editable*/font-size:10px;/*@editable*/line-height:125%;/*@editable*/text-align:left;}/*@tab Footer@section footer link@tip Set the styling for your emails footer links. Choose a color that helps them stand out from your text.*/.footerContainer .mcnTextContent a{/*@editable*/color:#CCCCCC;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}@media only screen and (max-width: 480px){body,table,td,p,a,li,blockquote{-webkit-text-size-adjust:none !important;}}@media only screen and (max-width: 480px){body{width:100% !important;min-width:100% !important;}}@media only screen and (max-width: 480px){#templateContainer,#templatePreheader,#templateHeader,#templateColumns,#templateBody,#templateFooter{max-width:600px !important;width:100% !important;}}@media only screen and (max-width: 480px){.columnsContainer{display:block!important;max-width:600px !important;padding-bottom:18px !important;padding-left:0 !important;width:100%!important;}}@media only screen and (max-width: 480px){.mcnImage{height:auto !important;width:100% !important;}}@media only screen and (max-width: 480px){.mcnCartContainer,.mcnCaptionTopContent,.mcnRecContentContainer,.mcnCaptionBottomContent,.mcnTextContentContainer,.mcnBoxedTextContentContainer,.mcnImageGroupContentContainer,.mcnCaptionLeftTextContentContainer,.mcnCaptionRightTextContentContainer,.mcnCaptionLeftImageContentContainer,.mcnCaptionRightImageContentContainer,.mcnImageCardLeftTextContentContainer,.mcnImageCardRightTextContentContainer{max-width:100% !important;width:100% !important;}}@media only screen and (max-width: 480px){.mcnBoxedTextContentContainer{min-width:100% !important;}}@media only screen and (max-width: 480px){.mcnImageGroupContent{padding:9px !important;}}@media only screen and (max-width: 480px){.mcnCaptionLeftContentOuter .mcnTextContent,.mcnCaptionRightContentOuter .mcnTextContent{padding-top:9px !important;}}@media only screen and (max-width: 480px){.mcnImageCardTopImageContent,.mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent{padding-top:18px !important;}}@media only screen and (max-width: 480px){.mcnImageCardBottomImageContent{padding-bottom:9px !important;}}@media only screen and (max-width: 480px){.mcnImageGroupBlockInner{padding-top:0 !important;padding-bottom:0 !important;}}@media only screen and (max-width: 480px){.mcnImageGroupBlockOuter{padding-top:9px !important;padding-bottom:9px !important;}}@media only screen and (max-width: 480px){.mcnTextContent,.mcnBoxedTextContentColumn{padding-right:18px !important;padding-left:18px !important;}}@media only screen and (max-width: 480px){.mcnImageCardLeftImageContent,.mcnImageCardRightImageContent{padding-right:18px !important;padding-bottom:0 !important;padding-left:18px !important;}}@media only screen and (max-width: 480px){.mcpreview-image-uploader{display:none !important;width:100% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section heading 1@tip Make the first-level headings larger in size for better readability on small screens.*/h1{/*@editable*/font-size:13px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section heading 2@tip Make the second-level headings larger in size for better readability on small screens.*/h2{/*@editable*/font-size:13px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section heading 3@tip Make the third-level headings larger in size for better readability on small screens.*/h3{/*@editable*/font-size:18px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section heading 4@tip Make the fourth-level headings larger in size for better readability on small screens.*/h4{/*@editable*/font-size:13px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Boxed Text@tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px.*/.mcnBoxedTextContentContainer .mcnTextContent,.mcnBoxedTextContentContainer .mcnTextContent p{/*@editable*/font-size:14px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Preheader Visibility@tip Set the visibility of the emails preheader on small screens. You can hide it to save space.*/#templatePreheader{}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Preheader Text@tip Make the preheader text larger in size for better readability on small screens.*/.preheaderContainer .mcnTextContent,.preheaderContainer .mcnTextContent p{/*@editable*/font-size:14px !important;/*@editable*/line-height:115% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Header Text@tip Make the header text larger in size for better readability on small screens.*/.headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{/*@editable*/font-size:12px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Body Text@tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px.*/.bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{/*@editable*/font-size:12px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Left Column Text@tip Make the left column text larger in size for better readability on small screens. We recommend a font size of at least 16px.*/.leftColumnContainer .mcnTextContent,.leftColumnContainer .mcnTextContent p{/*@editable*/font-size:12px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Right Column Text@tip Make the right column text larger in size for better readability on small screens. We recommend a font size of at least 16px.*/.rightColumnContainer .mcnTextContent,.rightColumnContainer .mcnTextContent p{/*@editable*/font-size:12px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section footer text@tip Make the body content text larger in size for better readability on small screens.*/.footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{/*@editable*/font-size:12px !important;/*@editable*/line-height:115% !important;}}</style> <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"> <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto"> </head> <body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0"> <!--[if !gte mso 9]> <!----> <span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;"> </span> <!--<![endif]--> <!--*|END:IF|*--> <center> <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable"> <tr> <td align="center" valign="top" id="bodyCell"> <!-- BEGIN TEMPLATE // --> <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateContainer"> <tr> <td align="center" valign="top"> <!-- BEGIN PREHEADER // --> <table border="0" cellpadding="0" cellspacing="0" width="600" id="templatePreheader"> <tr> <td valign="top" class="preheaderContainer" style="padding-top:9px; padding-bottom:9px;"> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width:100%;"> <tbody class="mcnImageBlockOuter"> <tr> <td valign="top" style="padding:0px" class="mcnImageBlockInner"> <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" style="min-width:100%;"> <tbody> <tr> <td valign="top" style="padding-right: 0px; color:white; padding-bottom: 0; text-align:left;height:160px; background-image: url(\'https://ticketdelivery.herokuapp.com/images/head_mail.jpg\');"> <span style="position:absolute;margin-left:18px;top:18px;font-family:Roboto; font-size:11pt;">Your Pepper Tickets</span>  <span style="position:absolute; top:95px;margin-left:80px;font-family:Roboto; font-size:11pt;"><!-- {EVENT_NAME} --> </span> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </table> <!-- // END PREHEADER --> </td> </tr> <tr> <td align="center" valign="top"> <!-- BEGIN HEADER // --> <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateHeader"> <tr> <td valign="top" class="headerContainer"> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;"> <!--[if mso]> <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;"> <tr> <![endif]--> <!--[if mso]> <td valign="top" width="599" style="width:599px;"> <![endif]--> <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer"> <tbody> <tr> <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;"> </td> </tr> </tbody> </table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> </tr> </table> <![endif]--> </td> </tr> </tbody> </table> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;"> <!--[if mso]> <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;"> <tr> <![endif]--> <!--[if mso]> <td valign="top" width="599" style="width:599px;"> <![endif]--> <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer"> <tbody> <tr> <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;font-size:12px;"> <strong>Congratulations &lt;Name&gt;</strong> <br>Thank you for buying tickets from us. <br> Please review the details of your purchase. </td> </tr> </tbody> </table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> </tr> </table> <![endif]--> </td> </tr> </tbody> </table> </td> </tr> </table> <!-- // END HEADER --> </td> </tr> <tr> <td align="center" valign="top"> <!-- BEGIN BODY // --> <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateBody"> <tr> <td valign="top" class="bodyContainer"> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;"> <!--[if mso]> <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;"> <tr> <![endif]--> <!--[if mso]> <td valign="top" width="599" style="width:599px;"> <![endif]--> <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer"> <tbody> <tr> <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;font-size:12px;"> <strong>Receipt&nbsp;Details&nbsp;</strong> <br>&lt;Event&gt; &lt;City&gt;&nbsp;- &lt;Date&gt;&nbsp;at &lt;Time&gt; <br>&lt;Quantity&gt; &lt;type of ticket&gt; &lt;Price&gt; =&nbsp; &lt;Total Cost&gt; &nbsp; <br>Total Cost: &lt;Total Cost&gt; </td> </tr> </tbody> </table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> </tr> </table> <![endif]--> </td> </tr> </tbody> </table> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;"> <!--[if mso]> <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;"> <tr> <![endif]--> <!--[if mso]> <td valign="top" width="599" style="width:599px;"> <![endif]--> <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer"> <tbody> <tr> <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;font-size:12px;"> <strong>Your Order</strong> <br>Order&nbsp;#: &lt;Order&gt; <br>Order&nbsp;date: &lt;orderDate&gt;&nbsp; <br>Customer #: &lt;Customer&gt; <br>Customer name: &lt;Name&gt; <br>Delivery method: &lt;Delivery method&gt; <br>Number of tickets: &lt;Number of Tickets&gt;​ <br> </td> </tr> </tbody> </table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> </tr> </table> <![endif]--> </td> </tr> </tbody> </table> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;"> <!--[if mso]> <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;"> <tr> <![endif]--> <!--[if mso]> <td valign="top" width="599" style="width:599px;"> <![endif]--> <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer"> <tbody> <tr> <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;font-size:12px;"> <strong>About This Event</strong> <br>&lt;Date&gt; from &lt;Start Time&gt; <br>&lt;Location&gt;&nbsp; <br>&nbsp; </td> </tr> </tbody> </table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> </tr> </table> <![endif]--> </td> </tr> </tbody> </table> </td> </tr> </table> <!-- // END BODY --> </td> </tr> <tr> <td align="center" valign="top"> <!-- BEGIN COLUMNS // --> <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateColumns"> <tr> <td align="left" valign="top" class="columnsContainer" width="50%"> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="templateColumn"> <tr> <td valign="top" class="leftColumnContainer"> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;"> <!--[if mso]> <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;"> <tr> <![endif]--> <!--[if mso]> <td valign="top" width="300" style="width:300px;"> <![endif]--> <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer"> <tbody> <tr> <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px;font-size:12px; padding-bottom:9px; padding-left:18px;"> Thank you for buying from us. </td> </tr> </tbody> </table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> </tr> </table> <![endif]--> </td> </tr> </tbody> </table> </td> </tr> </table> </td> <td align="left" valign="top" class="columnsContainer" width="50%"> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="templateColumn"> <tr> <td valign="top" class="rightColumnContainer"></td> </tr> </table> </td> </tr> </table> <!-- // END COLUMNS --> </td> </tr> <tr> <td align="center" valign="top" style="padding-bottom:40px;"> <!-- BEGIN FOOTER // --> <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateFooter"> <tr> <td valign="top" class="footerContainer" style="padding-top:9px; padding-bottom:9px;"> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width:100%;"> <tbody class="mcnImageBlockOuter"> <tr> <td valign="top" style="padding:0px" class="mcnImageBlockInner"> <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="min-width:100%;"> <tbody> <tr> <td class="mcnImageContent" valign="top" style="padding-right: 0px; padding-left: 0px; padding-top: 0; padding-bottom: 0; text-align:center;"> <img align="center" alt="" src="https://gallery.mailchimp.com/2392b91a60b1f0f004fceddc8/images/2aa318f2-ccb2-4805-b914-ccf1b09844a4.png" width="50" style="max-width:50px; padding-bottom: 0; display: inline !important; vertical-align: bottom;" class="mcnImage"> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;"> <!--[if mso]> <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;"> <tr> <![endif]--> <!--[if mso]> <td valign="top" width="599" style="width:599px;"> <![endif]--> <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer"> <tbody> <tr> <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;"> <span style="color:#000000"><em>Copyright © 2017 Pepper bot, All rights reserved.</em> <br>You are receiving this email because you opted to buy from Pepper bot.&nbsp; <br> <br><strong>Contact Information:</strong> <br>Pepper bot <br>business.joinpepper.com <br><u>contact@spotlightstudio.org</u> <br> </td> </tr> </tbody> </table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> </tr> </table> <![endif]--> </td> </tr> </tbody> </table> </td> </tr> </table> <!-- // END FOOTER --> </td> </tr> </table> <!-- // END TEMPLATE --> </td> </tr> </table> </center> </body></html>';
    templateHTML = templateHTML.replace('&lt;Name&gt;', nombreCliente);
    templateHTML = templateHTML.replace('&lt;Name&gt;', nombreCliente);
    templateHTML = templateHTML.replace('&lt;Event&gt;', eventoNombre);
    templateHTML = templateHTML.replace('{EVENT_NAME}', eventoNombre);
    templateHTML = templateHTML.replace('&lt;Event&gt;', eventoNombre);
    templateHTML = templateHTML.replace('&lt;City&gt;', ciudadEvento);
    templateHTML = templateHTML.replace('&lt;City&gt;', ciudadEvento);
    templateHTML = templateHTML.replace('&lt;Date&gt;', fechaEvento);
    templateHTML = templateHTML.replace('&lt;Date&gt;', fechaEvento);
    templateHTML = templateHTML.replace('&lt;Time&gt;', horaEvento);
    templateHTML = templateHTML.replace('&lt;Start Time&gt;', horaEvento);
    templateHTML = templateHTML.replace('&lt;Quantity&gt;', cantidadTickets);
    templateHTML = templateHTML.replace('&lt;Number of Tickets&gt;', cantidadTickets);
    templateHTML = templateHTML.replace('&lt;type of ticket&gt;', tipoTickets);
    templateHTML = templateHTML.replace('&lt;Price&gt;', precio);
    templateHTML = templateHTML.replace('&lt;Total Cost&gt;', '$' + costoTotal);
    templateHTML = templateHTML.replace('&lt;Total Cost&gt;', '$' + costoTotal);
    templateHTML = templateHTML.replace('&lt;Order&gt;', ordenNumber);
    templateHTML = templateHTML.replace('&lt;orderDate&gt;', fechaOrden);
    templateHTML = templateHTML.replace('&lt;Customer&gt;', clienteId);
    templateHTML = templateHTML.replace('&lt;Location&gt;', venueEvento);

    if (format == 'Eticket') {
        templateHTML = templateHTML.replace('&lt;Delivery method&gt;', 'Eticket - Email with PDF');

    } else {

        templateHTML = templateHTML.replace('&lt;Delivery method&gt;', 'FedEx');

    }


    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    var msg = {
        to: emailsArray,
        from: 'PepperBot Tickets <thepepperbot@gmail.com>',
        subject: 'Your Event tickets!',
        html: templateHTML,
    };
    //console.log("<msg>" + JSON.stringify(msg));

    sgMail.send(msg, function (err, body) {
        console.log("<correo>" + JSON.stringify(err));
        console.log("<correo>" + JSON.stringify(body));

    });
}







module.exports = {
    finish
}