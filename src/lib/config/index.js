var express = require("express"),
	app = module.exports = express(),
	config = require('models/config');

app.get("/config", function (req, res) {
	config.findOne(null, function (err, data) {
		if (err) {
			return res.send(err, 500);
		}
		if (!data) {
			return res.send("Couldn't find config", 404);
		}
		res.json(data);
	});
});