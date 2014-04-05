var mongoose  = require('mongoose');

//var UserModel = require('./user');
//var TagModel  = require('./tag');

var imgSchema = mongoose.Schema({
	hash_id : {type: String, lowercase: true, unique: true },
	user    : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},  //[ UserModel.schema ],
	rating  : {type: Number, default: null},
	tags    : [ String ] //[{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}], //[ TagModel.schema ],
});

var Img = mongoose.model('Img', imgSchema);

module.exports = Img;