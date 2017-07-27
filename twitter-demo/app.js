var http = require('http');
var request = require("request");
var url = require('url');

var name = 'node-hello-world';
var port = '5000';

var app = new http.Server();

var apikey = "<Interbot API Key>";
var botname = "<Interbot bot name>";
var twitterbotname = "<Telegram bot name>";


function generateRefID(callback) {
	var options = { method: 'POST',
 		url: 'https://ibc.interbot.cc/ibc/bot/' + botname + '/refid',
 		headers:
  		{
  			'content-type': 'application/x-www-form-urlencoded',
   			apikey: apikey
   		}
   	};

	request(options, function (error, response, body) {
		var refid = body;
		console.log("Got refid:" + refid);
		callback(refid);
 	});
}
function sendIBCMessage(refid, recipient, text, cb) {
    var options = {
        method: 'POST',
        url: 'https://ibc.interbot.cc/ibc/bot/' + botname + '/sendmsg',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'apikey': apikey
        },
        form: {
            message: text,
            destbotname: recipient,
            refid: refid
        }
    };

    console.log("Sending IBC message:" + text + " to " + recipient);

    request(options, function (error, response, body) {
        return cb(error);
    });
}


app.on('request', (req, res) => {
	var query = url.parse(req.url,true).query;
    var msgobj = (JSON.parse(query.messageobj));
    var senderobj = (JSON.parse(query.senderobj));
    var contextobj = (JSON.parse(query.contextobj));

	console.log("Got request:\n  " + JSON.stringify(msgobj) + "\n from sender:\n  " + JSON.stringify(senderobj));

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('');
    res.end('\n');
});


app.listen(port, () => {
    console.log(`${name} is listening on port ${port}`);
});


setTimeout(function() {
	generateRefID(function(refid) {
		sendIBCMessage(refid, twitterbotname + "$twitter", "hello", function(err) {})
});
}, 3000);

