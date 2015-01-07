module.exports = function (mongoose) {
	mongoose.model(
		'Page',
		new mongoose.Schema({
			name: String,
			subs: [mongoose.Schema.Types.ObjectId]
		})
	);
};