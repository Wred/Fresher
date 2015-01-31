module.exports = function (mongoose) {
	mongoose.model(
		'Page',
		new mongoose.Schema({
			name: String,
			image: String,
			children: [mongoose.Schema.Types.ObjectId]
		})
	);
};