var mongoose = require('mongoose');

module.exports = mongoose.model('Test',
	new mongoose.Schema({
		name: String,
		rootPage: mongoose.Schema.Types.ObjectId
	})
);