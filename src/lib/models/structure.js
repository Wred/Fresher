module.exports = function (mongoose) {
	mongoose.model(
		'Structure',
		new mongoose.Schema({
			name: String
		})
	);
};