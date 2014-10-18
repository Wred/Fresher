var mers = require('mers'),
	express = require("express"),
	app = module.exports = express();

app.use('/rest', mers({uri:'mongodb://localhost/fresher'}).rest());