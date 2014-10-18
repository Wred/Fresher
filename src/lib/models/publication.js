var mongoose = require('mongoose');

module.exports = mongoose.model('Publication',
	new mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,
		name: String,
		rootPage: mongoose.Schema.Types.ObjectId
	})
);