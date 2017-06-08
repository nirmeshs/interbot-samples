Interbot Connector for AWS Lex bots.

In order to use this connector, you need to first have a working bot on AWS Lex. Next, you need to sign up on https://www.interbot.cc/.

Next, please set the AWS access key id, the AWS access key secret and the AWS Region in config.json. Once this is done, please build the project and deploy it.

Please note that this sends the reply directly on the http request and hence does not need Interbot creds.

Now, you need to create a bot in interbot with the chosen unique name and the URL corresponding to app.js (by default http://<ip-address>:5000/). Once this is successfully done, you can test the bot.
