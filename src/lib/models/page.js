module.exports = function (mongoose) {
	mongoose.model(
		'Page',
		new mongoose.Schema({
			_id: mongoose.Schema.Types.ObjectId,
			name: String,
			subs: [mongoose.Schema.Types.ObjectId]
		})
	);
};