/** @type {Array} */
var _0x6b64 = [
    "request", //0
    "https://graph.facebook.com/v2.6/me/messages", //1
    "PAGE_ACCESS_TOKEN", //2
    "env", //3
    "POST", //4
    "template", //5
    "generic", //6
    "-----------------", //7
    "log", //8
    "button", //9
    "location", //10
    "mark_seen", //11
    "typing_off", //12
    "typing_on", //13
    "getTime", //14
    "exports" //15
];

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

function genericButton(term, elts) {
    return new Promise((resolve, reject) => {
        request({
            url: _0x6b64[1],
            qs: {
                access_token: process[_0x6b64[3]][_0x6b64[2]]
            },
            method: _0x6b64[4],
            json: {
                "recipient": {
                    "id": term
                },
                "message": {
                    "attachment": {
                        "type": _0x6b64[5],
                        "payload": {
                            "template_type": _0x6b64[6],
                            "elements": elts
                        }
                    }
                }
            }
        }, function (x, message, dataAndEvents) {
            console[_0x6b64[8]](_0x6b64[7]);
            console[_0x6b64[8]](x);
            console[_0x6b64[8]](message);
            if (x) {
                return false;
            } else {
                return true;
            }
        });
    });
}

module.exports = {
    genericButton

}