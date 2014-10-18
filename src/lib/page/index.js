var express = require("express"),
	app = module.exports = express(),
	page = require('models/page');


app.get("/page/:id", function (req, res) {
	page.findOne({_id:req.params.id}, function (err, data) {
		if (err) {
			return res.send(err, 500);
		}
		if (!data) {
			return res.send("Couldn't find page: "+ req.params.id, 404);
		}

		res.json(data);
	});
});