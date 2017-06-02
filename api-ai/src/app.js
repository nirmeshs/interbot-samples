'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const InterBot = require('./interbot');
const InterBotConfig = require('./interbotconfig');

const REST_PORT = (process.env.PORT || 5000);
const DEV_CONFIG = process.env.DEVELOPMENT_CONFIG == 'true';

const APIAI_LANG = 'en';

const APIAI_ACCESS_TOKEN = '<API_AI_ACCESS_TOKEN>';
const INTERBOT_API_KEY = '<INTERBOT_API_KEY>';
const INTERBOT_BOTNAME = '<INTERBOT_BOT_NAME>';

// console timestamps
require('console-stamp')(console, 'yyyy.mm.dd HH:MM:ss.l');

const botConfig = new InterBotConfig(APIAI_ACCESS_TOKEN, APIAI_LANG, INTERBOT_BOTNAME, INTERBOT_API_KEY);
const bot = new InterBot(botConfig);

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get('/interbot', (req, res) => {

    console.log('POST sms received');

    try {
        bot.processMessage(req, res);
    } catch (err) {
        return res.status(400).send('Error while processing ' + err.message);
    }
});

app.listen(REST_PORT, function () {
    console.log('Rest service ready on port ' + REST_PORT);
});
