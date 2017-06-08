var AWS = require('aws-sdk')
var http = require('http');
var query = require('url');
var url = require('url');

var name = 'node-hello-world';
var port = '5000';
var app = new http.Server();

AWS.config.loadFromPath('./config.json');
var lexruntime = new AWS.LexRuntime({
	apiVersion: '2016-11-28',
});


app.on('request', (req, res) => {
	var query = url.parse(req.url,true).query;
	console.log(JSON.stringify(query));
	var msg = (JSON.parse(query.messageobj)).text;
	var params = {
	  botAlias: '$LATEST',
	  botName: 'BookTrip',
	  inputText: msg,
	  userId: 'aldkjfenl', /* based on the user / roomid */
	  sessionAttributes: {
	  }
	};

	lexruntime.postText(params, function (err, data) {
	  if (err) {
	  	console.log(err, err.stack);
	  	res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.write('Some error occurred');
		res.end('\n');
	  }
	  else {
	  	res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.write(data.message);
		res.end('\n');
    	console.log(data);
	  }
	});
});

app.listen(port, () => {
  console.log(`${name} is listening on port ${port}`);
});





