var express = require("express"),
	app = module.exports = express(),
	publication = require('models/publication');

app.get("/publications", function (req, res) {
	publication.find(null, function (err, data) {
		if (err) {
			return res.send(err, 500);
		}
		if (!data) {
			return res.send("Couldn't find publication", 404);
		}
		res.json(data);
	});
});