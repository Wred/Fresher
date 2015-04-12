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
var Publication = require('models/publication')(mongoose),
	Page = require('models/page')(mongoose),
	Config = require('models/config')(mongoose),
	Structure = require('models/structure')(mongoose);

// REST to mongodb (using mongoose models)
app.use('/rest', require('mers')({mongoose:mongoose}).rest());

// Initialize instance:
app.get('/init', function (req, res) {
	var db = mongoose.connection.db;
	db.dropDatabase();

	// create home page
	db.collection("pages").insert({name:"Home",children:[],image:"page.gif"}, function (err, result) {
		if (err)
			return res.status(500).send(err);

		var page = result.ops[0];

		// create publication
		db.collection("publications").insert({name:"pub",rootPage:page._id});

		// create structure
		db.collection("structures").insert({name:"Home",image:"page.gif"});
		db.collection("structures").insert({name:"Section",image:"folder.gif"});

		res.send("OK");
	});
});

server.listen(5000, "127.0.0.1");
console.log('Fresher started.');