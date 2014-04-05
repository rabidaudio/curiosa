var express = require('express');
var mongoose = require('mongoose');

var app = express();
app.use(express.bodyParser());
mongoose.connect('mongodb://localhost/test');


function err_handler(err){
	if(err) throw err;
}

var tagSchema = mongoose.Schema({
	data: String,
});

var userSchema = mongoose.Schema({
	hash_id: {type: String, lowercase: true},
	last_access: {type: Date, default: Date.now},
	last_ip: String,
});

var imgSchema = mongoose.Schema({
	hash_id: {type: String, lowercase: true},
	user: [ userSchema ],
	rating: {type:Number, default: 0},
	tags: [ tagSchema ],
});


var Img = mongoose.model('Img', imgSchema);
var User = mongoose.model('User', userSchema);
var Tag = mongoose.model('Tag', tagSchema);


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	var u = new User({
		hash_id: "jules",
		last_ip: "1234",
	});
	var t = Array(2);
	t[0] = new Tag({data: 'meow'});
	t[1] = new Tag({data: 'bark'});
	var i = new Img({
		hash_id: "test1234",
		user: u,
		tags: t,
	});
	u.save(function(err){
		if(err) throw err;
		t[0].save();
		t[1].save(function(err){
			if(err) throw err;
			i.save(function(err){
				if(err) throw err;
				console.log("YAY");
				Img.findOne({
					hash_id: "test1234",
					'user.hash_id': 'jules',
				}, function(err, img){
					if(err) throw err;
					console.log(img);
				});
			});
		});
	});
});