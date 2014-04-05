var express = require('express');
var mongoose = require('mongoose');
var https = require('https');
var fs = require('fs');


var sslkey = fs.readFileSync('certs/ssl-key.pem');
var sslcert = fs.readFileSync('certs/ssl-cert.pem');

var options = {
    key: sslkey,
    cert: sslcert
};

var app = express();
app.use(express.bodyParser());
mongoose.connect('mongodb://localhost/test');


var UserModel = require('models/user');
var TagModel = require('models/tag');


function err_handler(err){
	if(err) throw err;
}


/*Methods (api.curiosadb.com/img/IMAGE-ID/)
{	user:uuid, secret:secret	} <- required for all queries
{	raters:int (default:all), tags:int (default: top 20) } <- optional for get queries

	GET: 		get user's ratings and tags
	POST/PUT: 	submit user's ratings and tags
	DELETE:  	delete user's ratings and tags

	/img/IMAGE-ID/rating
	GET, POST/PUT, DELETE

	/img/IMAGE-ID/tags
	GET, POST (add tags), PUT(replace tags), DELETE

	/img/IMAGE-ID/tags/:id
	GET, POST/PUT, DELETE

	READ ONLY (community)
	/img/IMAGE-ID/all
	/img/IMAGE-ID/all/rating
	/img/IMAGE-ID/all/tags
	/img/IMAGE-ID/all/tags/:id
*/

var imgSchema = mongoose.Schema({
	hash_id: {type: String, lowercase: true},
	user: [ userSchema ],
	rating: {type:Number, default: null},
	tags: [ tagSchema ],
});


var Img = mongoose.model('Img', imgSchema);


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	express.createServer(options);
	/*var u = new User({
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
	});*/
	/*u.save(function(err){
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
	});*/
});