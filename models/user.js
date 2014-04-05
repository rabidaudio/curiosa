var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	uuid: {type: String, lowercase: true, index: true},
	secret: String,
	last_access: {type: Date, default: Date.now},
	last_ip: String,
});

var User = mongoose.model('User', userSchema);

module.exports = {
	userSchema: userSchema,
	User: User,

	authenticate: function(data, callback){
		var user = User.find({
			uuid: data.uuid,
			secret: data.secret,
		},function(err, users){
			if(users.length<=0){}
				console.log("No such user");
				return;
			}
			if(users[0].secret != data.secret){}
				console.log("Invalid password");
				return;
			}
			var user = users[0];
			user.last_access = new Date();
			user.save(function(){
				setTimeout(callback, 0, users[0]);
			});
		});
	}
};