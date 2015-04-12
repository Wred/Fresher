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

	// clear the database
	db.dropDatabase();

	// generate an ID for the content element
	var contentID = mongoose.Types.ObjectId();

	// create home structure
	db.collection("structures").insert({
		name:"Home",
		image:"page.gif",
		defaultElements: [{
			id: contentID,
			name: "Content",
			type: "Text"
		}]
	}, function (err, result) {
		if (err)
			return res.status(500).send(err);
		
		var structure = result.ops[0];

		// create home page
		db.collection("pages").insert({
			name:"Home",
			image:"page.gif",
			children:[],
			structure:structure._id,
			elements:[{
				id: contentID,
				values: [{
					lang: 'en',
					value: 'Hello world!!'
				}]
			}]
		}, function (err, result) {
			if (err)
				return res.status(500).send(err);

			var page = result.ops[0];

			// create first publication and set this as the root page
			db.collection("publications").insert({name:"pub",rootPage:page._id});

			res.send("OK");
		});
	});
});

server.listen(5000, "127.0.0.1");
console.log('Fresher started.');