var mongoose = require('mongoose');

var tagSchema = mongoose.Schema({
	data: String,
});

var Tag = mongoose.model('Tag', tagSchema);

module.exports = {
	tagSchema: tagSchema,
	Tag: Tag,
};