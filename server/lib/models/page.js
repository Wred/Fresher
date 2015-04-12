module.exports = function (mongoose) {
	mongoose.model(
		'Page',
		new mongoose.Schema({
			name: String,
			image: String,
			children: [mongoose.Schema.Types.ObjectId],
			structure: mongoose.Schema.Types.ObjectId,
			elements: [{
				// get the name from the structure elements
				// use id to link to the structure element
				id: mongoose.Schema.Types.ObjectId,
				values: [{
					lang: 'string',
					// value can be string, rich text, number, boolean, date, etc.
					value: mongoose.Schema.Types.Mixed
				}]
			}]
		})
	);
};