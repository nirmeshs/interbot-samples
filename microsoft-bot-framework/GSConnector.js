"use strict";
var request = require("request");
var async = require("async");
var jwt = require("jsonwebtoken");
var zlib = require("zlib");
var urlJoin = require("url-join");
var url = require('url');

var utils = require("botbuilder/lib/utils");
var logger = require("botbuilder/lib/logger");
var consts = require("botbuilder/lib/consts");

var pjson = require('./package.json');

var MAX_DATA_LENGTH = 65000;
var userDataCache={};
var conversationIdCache={};
var conversationDataCache={};

var ChatConnector = (function () {
    function ChatConnector(settings) {
        if (settings === void 0) { settings = {}; }
        this.settings = settings;
    }
    ChatConnector.prototype.listen = function () {
        var _this = this;
        return function (req, res) {
            _this.dispatch(req, res);
        };
    };
    ChatConnector.prototype.onEvent = function (handler) {
        this.onEventHandler = handler;
    };
    ChatConnector.prototype.onInvoke = function (handler) {
        this.onInvokeHandler = handler;
    };
    ChatConnector.prototype.send = function (messages, done) {
        console.log("Sending multiple messages:" + messages.length);
        var _this = this;
        async.eachSeries(messages, function (msg, cb) {
            try {
                if (msg.address && msg.address.serviceUrl) {
                    _this.postMessage(msg, cb);
                }
                else {
                    logger.error('ChatConnector: send - message is missing address or serviceUrl.');
                    cb(new Error('Message missing address or serviceUrl.'));
                }
            }
            catch (e) {
                cb(e);
            }
        }, done);
    };
    ChatConnector.prototype.startConversation = function (address, done) {
        done(new Error('Not supported'));
    };
    ChatConnector.prototype.getData = function (context, callback) {
        var data = {};
        callback(null, data);
    };
    ChatConnector.prototype.saveData = function (context, data, callback) {
        //var err = new Error("Not Supported");
        callback(null);
    };
    ChatConnector.prototype.dispatch = function (req, res) {
        try {
            var msg = this.prepIncomingMessage(req);
            if (this.isInvoke(msg)) {
                this.onInvokeHandler(msg, function (err, body, status) {
                    if (err) {
                        console.log("Replying 500");
                        res.status(500);
                        res.end();
                        logger.error('Received error from invoke handler: ', err.message || '');
                    }
                    else {
                        console.log("Replying 200");
                        res.send(status || 200, body);
                    }
                });
            }
            else {
                this.onEventHandler([msg]);
                console.log("Replying 202");
                res.status(202);
                res.end();
            }
        }
        catch (e) {
            console.error(e instanceof Error ? e.stack : e.toString());
            res.status(500);
            res.end();
        }
    };
    ChatConnector.prototype.isInvoke = function (message) {
        return (message && message.type && message.type.toLowerCase() == consts.invokeType);
    };
    ChatConnector.prototype.postMessage = function (msg, cb) {
        var address = msg.address;
        var text = msg.text;
        var recipient = address.user;
        delete msg.address;

        var options = {
            method: 'POST',
            url: 'https://ibc.interbot.cc/ibc/bot/' + this.settings.botname + '/sendmsg',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'apikey': this.settings.apikey
            },
            form: {
                message: text,
                destbotname: recipient.id 
            }
        };

        request(options, function (error, response, body) {
            console.log("ERR:" + error);
            console.log("Body:" + body);
            return cb(error);
        });
    };
    ChatConnector.prototype.prepIncomingMessage = function (req) {
        var query = url.parse(req.url,true).query;
        console.log(JSON.stringify(query));
        var msgobj = (JSON.parse(query.messageobj));
        var senderobj = (JSON.parse(query.senderobj));
        var contextobj = (JSON.parse(query.contextobj));

        var msg = {
            "text": msgobj.text,
            "attachments": [],
            "entities": [],
            "address": {
                "id": contextobj.contextid,
                "channelId": contextobj.channeltype,
                "user": {
                    "id": senderobj.channelid
                },
                "conversation": "conversation",
                "recipient": "bot",
                "serviceUrl": {},
                "useAuth": false
            },
            "locale": "en-us",
            "channelData": "sourceEvent",
            "source": "gupshup"
        };
        return msg;
    };
    return ChatConnector;
}());
exports.ChatConnector = ChatConnector;
