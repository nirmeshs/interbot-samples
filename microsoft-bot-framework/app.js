var restify = require('restify');
var msbuilder = require('botbuilder');
var gsbuilder = require('./GSConnector');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(5000, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
var connector = new gsbuilder.ChatConnector({
    botname: '<GS Bot Name>',
    apikey: '<GS API Key>'
});
var bot = new msbuilder.UniversalBot(connector);

var msconnector = new msbuilder.ChatConnector({
    appId: '<MS App Id>',
    appPassword: '<MS App Password>'
});
var msbot = new msbuilder.UniversalBot(msconnector);
// {lookupUser: function(address, callback){callback(null,{"id":address });} }
server.get('/api/messages', connector.listen());
server.post('/api/messages/ms', msconnector.listen());
configure(bot);
configure(msbot);
//=========================================================
// Bots Dialogs
//=========================================================
function configure(bot){
	bot.dialog('/',[
	    function (session,results) {
	    	console.log("In dialog");
	    	session.send('hello world');
	    }
	]);

}

