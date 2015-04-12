module.exports = function (mongoose) {
	mongoose.model(
		'Structure',
		new mongoose.Schema({
			name: String,
			image: String,
			defaultElements: [{
				id: mongoose.Schema.Types.ObjectId,
				name: String,
				type: String
			}]
		})
	);
};