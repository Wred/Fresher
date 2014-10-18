var mongoose = require('mongoose');

module.exports = mongoose.model('Config',
	new mongoose.Schema({
		name: String,
		rootPage: mongoose.Schema.Types.ObjectId
	})
);