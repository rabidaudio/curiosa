var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	uuid: {type: String, lowercase: true, index: true},
	secret: String,
	last_access: {type: Date, default: Date.now},
	last_ip: String,
});

var User = mongoose.model('User', userSchema);

User.methods.update_timestamp = function(cb){
	if(!cb) cb = new Function();
	this.last_access = new Date();
	this.save(cb);
};

User.statics.authenticate = function(data, callback){
	User.findOne({
		uuid: data.uuid,
	},function(err, user){
		if(err) throw err;
		if(!user){
			console.log("No such user");
			return;
		}
		if(user.secret != data.secret){
			console.log("Invalid password");
			return;
		}
		/*user.last_access = new Date();
		user.save(function(){
			setTimeout(callback, 0, user);
		});*/
		user.update_timestamp(callback);
	});
};


module.exports = User;