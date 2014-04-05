var mongoose = require('mongoose');

var tagSchema = mongoose.Schema({
	data: {type: String, index: true},
});

tagSchema.method('toString', function(){
	return this.data;
});

var Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;