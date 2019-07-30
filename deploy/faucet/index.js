const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

let app = express();

require('./src/helpers/blockchain-helper')(app);

let config;
const configPath = './config.json';
const configExists = fs.existsSync(configPath, fs.F_OK);
if (configExists) {
	config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} else {
	return console.log('There is no config.json file');
}
app.config = config;

app.configureWeb3(config)
.then(web3 => {
	app.web3 = web3;
  	app.set("view engine", "pug");
	app.set("views", path.join(__dirname, "/public/views"));
	app.use(express.static(__dirname + '/public'));
	app.use(bodyParser.json({
		limit: '50mb',
	}));
	app.use(bodyParser.urlencoded({
		limit: '50mb',
		extended: true,
	}));

	require('./src/controllers/index')(app);

	app.get('/', function(request, response) {
	  response.render('index', {
        minAmount: app.config.Ethereum.milliEtherToTransferWithoutTweet / 1000,
        maxAmount: app.config.Ethereum.milliEtherToTransferWithTweet / 1000,
        sitekey: app.config.Captcha.sitekey,
        cooldown: app.config.Tweeter.cooldown,
        predefinedTweetUrl: encodeURI(
        	"https://twitter.com/intent/tweet?text=" + app.config.Tweeter.predefinedTweet
		  + "&hashtags=" + app.config.Tweeter.predefinedHashTags
		)
      });
	});

    app.set('port', (process.env.PORT || 5000));

	app.listen(app.get('port'), function () {
	    console.log('Thundercloud faucet is running on port', app.get('port'));
	})
})
.catch(error => {
	return console.log(error);
});

module.exports = app;
