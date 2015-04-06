module.exports = function (mongoose) {
	mongoose.model(
		'Config',
		new mongoose.Schema({
			name: String,
			rootPage: mongoose.Schema.Types.ObjectId
		})
	);
};