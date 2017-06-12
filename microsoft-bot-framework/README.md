Gupshup connector for MS Bot framework Bots.

In order to use this connector, you need to sign up on https://www.interbot.cc/ and set the Interbot API key and the Interbot bot name (some unique string) in app.js. Once this is done, please build the project and deploy it.

You can also optionally set your Microsoft Bot Framework app id and password and simultaneously test the bot on MS Bot Framework.

Now, you need to create a bot in interbot with the chosen unique name and the URL corresponding to app.js (by default http://<ip-address>:5000/api/messages). Once this is successfully done, you can test the bot. To test it, navigate to My Bots on the interbot website (after loggin in) and click on the bot name. A chat popup will open. Type your message and the bot will send its response.

Please note that this does NOT do server side message conversion.
