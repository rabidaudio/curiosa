var mongoose  = require('mongoose');

//var UserModel = require('./user');
//var TagModel  = require('./tag');

hashRegex = /^[0-9a-f]{32}_[0-9]{7}/;

var imgSchema = mongoose.Schema({
    /*
        md5sum_#ofBytes(last7digits), e.g. 2e2917a498c5f3efee403507b5218a72_0035380
    */
	hash_id : {type: String, lowercase: true, unique: true, matches: hashRegex },
	user    : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},  //[ UserModel.schema ],
	rating  : {type: Number, default: null},
	tags    : [ String ] //[{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}], //[ TagModel.schema ],
});

var Img = mongoose.model('Img', imgSchema);

module.exports = Img;