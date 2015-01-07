module.exports = function (mongoose) {
	mongoose.model(
		'Publication',
		new mongoose.Schema({
			name: String,
			rootPage: mongoose.Schema.Types.ObjectId
		})
	);
};