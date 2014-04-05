var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	uuid: {type: String, lowercase: true, index: true},
	secret: String,
	last_access: {type: Date, default: Date.now},
	last_ip: String,
});

userSchema.method('update_timestamp', function(cb){
	if(!cb) cb       = new Function();
	this.last_access = new Date();
	this.save(cb);
});

userSchema.method('update_last_ip', function(ip, cb){
	if(!cb) cb   = new Function();
	this.last_ip = ip;
	this.save(cb);
});

userSchema.static('authenticate', function(req, res, next){
	console.log("auth");
	User.findOne({
		uuid: req.datar.uuid,
	},function(err, user){
		console.log(user);
		if(err) throw err;
		if(!user){
			res.send({error: "No such user."});
			return;
		}
		if(user.secret != req.datar.secret){
			res.send({error: "Invalid password."});
			return;
		}
		user.update_timestamp();
		user.update_last_ip(req.ips);
		console.log("auth done");
		next();
	});
});

var User = mongoose.model('User', userSchema);

module.exports = User;