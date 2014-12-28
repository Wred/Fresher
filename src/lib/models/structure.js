module.exports = function (mongoose) {
	mongoose.model(
		'Structure',
		new mongoose.Schema({
			_id: mongoose.Schema.Types.ObjectId,
			name: String
		})
	);
};