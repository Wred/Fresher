var express = require('express'),
	app = express(),
	http = require('http'),
	server = http.createServer(app),
	mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/fresher');

app.set('views', __dirname);
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));
// app.use(require("body-parser").json());

// models
require('models/publication')(mongoose);

// REST to mongodb (using mongoose models)
app.use('/rest', require('mers')({mongoose:mongoose}).rest());

app.get('/', function (req, res) {
	res.render('index');
});

server.listen(80);
console.log('\n\n\n\n\nFresher\nListening on port %d', server.address().port);