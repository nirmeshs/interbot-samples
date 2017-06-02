'use strict';

const apiai = require('apiai');
const uuid = require('node-uuid');
const request = require('request');
const xmlescape = require('xml-escape');


module.exports = class InterBot {

    get apiaiService() {
        return this._apiaiService;
    }

    set apiaiService(value) {
        this._apiaiService = value;
    }

    get botConfig() {
        return this._botConfig;
    }

    set botConfig(value) {
        this._botConfig = value;
    }

    get sessionIds() {
        return this._sessionIds;
    }

    set sessionIds(value) {
        this._sessionIds = value;
    }

    constructor(botConfig) {
        this._botConfig = botConfig;
        var apiaiOptions = {
            language: botConfig.apiaiLang,
            requestSource: "interbot"
        };

        this._apiaiService = apiai(botConfig.apiaiAccessToken, apiaiOptions);
        this._sessionIds = new Map();
    }

    processMessage(req, res) {
        if (this._botConfig.devConfig) {
            console.log("body", req.body);
        }

        if (req.query && req.query.senderobj && req.query.messageobj) {
            let messageobj = JSON.parse(req.query.messageobj);
            let senderobj = JSON.parse(req.query.senderobj);
            let chatId = senderobj.channelid;
            let messageText = messageobj.text;

            console.log(chatId, messageText);
            
            if (messageText) {
                if (!this._sessionIds.has(chatId)) {
                    this._sessionIds.set(chatId, uuid.v4());
                }

                let apiaiRequest = this._apiaiService.textRequest(messageText,
                    {
                        sessionId: this._sessionIds.get(chatId),
                        originalRequest: {
                            data: "somebody",
                            source: "interbot"
                        }
                    });

                apiaiRequest.on('response', (response) => {
                    if (InterBot.isDefined(response.result)) {
                        let responseText = response.result.fulfillment.speech;

                        if (InterBot.isDefined(responseText)) {
                            console.log('Response as text message');
                            //res.setHeader("Content-Type", "application/xml");
                            var request = require("request");

                            var options = { method: 'POST',
                              url: 'https://ibc.interbot.cc/ibc/bot/' + this._botConfig.interbotBotName + '/sendmsg',
                              headers: {
                                'apikey': this._botConfig.interbotApiKey
                              },
                              body: {
                                message: responseText,
                                destbotname: chatId 
                              }
                            };

                            request(options, function (error, response, body) {
                              console.log(error);
                              console.log(body);
                            });

                            res.status(200).end("");
                        } else {
                            console.log('Received empty speech');
                        }
                    } else {
                        console.log('Received empty result')
                    }
                });

                apiaiRequest.on('error', (error) => console.error(error));
                apiaiRequest.end();
            }
            else {
                console.log('Empty message');
                return res.status(400).end('Empty message');
            }
        } else {
            console.log('Empty message');
            return res.status(400).end('Empty message');
        }
    }

    static isDefined(obj) {
        if (typeof obj == 'undefined') {
            return false;
        }

        if (!obj) {
            return false;
        }

        return obj != null;
    }
}
