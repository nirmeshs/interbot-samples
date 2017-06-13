Interbot Connector for Telegram bots.

In order to use this connector, you need to first have a working bot on Telegram. Next, you need to sign up on https://www.interbot.cc/.

Next, please set the Telegram bot name, the Interbot API key and the Interbot bot name (some unique string) in app.js. Once this is done, please build the project and deploy it.

Now, you need to create a bot in interbot with the chosen unique name and the URL corresponding to app.js (by default http://<ip-address>:5000/). Once this is successfully done, you can test the bot.

On running app.js, first a http server will start which will print any incoming messages as they arrive. Three seconds after starting, an IBC message will be sent to the telegram bot. The response will come back to the http server and will be displayed on screen.

Please note that for now, only one text message sent by the telegram bot in the next three seconds is sent back and only text replies are supported.

