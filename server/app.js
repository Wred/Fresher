process.env.NODE_PATH = "lib";
require('module').Module._initPaths();

var express = require('express'),
	app = express(),
	http = require('http'),
	server = http.createServer(app),
	mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/fresher');

app.use(require("body-parser").json());

// models
require('models/publication')(mongoose);
require('models/page')(mongoose);
require('models/config')(mongoose);
require('models/structure')(mongoose);

// REST to mongodb (using mongoose models)
app.use('/rest', require('mers')({mongoose:mongoose}).rest());

server.listen(5000, "127.0.0.1");
console.log('Fresher started.');