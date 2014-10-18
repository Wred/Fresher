var express = require('express'),
	app = express(),
	http = require('http'),
	server = http.createServer(app),
	mers = require('mers'),
	bodyParser = require("body-parser");

app.set('views', __dirname);
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// rest to mongodb
app.use('/rest', mers({uri:'mongodb://localhost/fresher'}).rest());

app.get('/', function (req, res) {
	res.render('index');
});

server.listen(80);
console.log('\n\n\n\n\nFresher\nListening on port %d', server.address().port);