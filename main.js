var express  = require('express');
var mongoose = require('mongoose');
var https    = require('https');
var http     = require('http');
var fs       = require('fs');
var _        = require('underscore');

var app = express();
app.use(express.bodyParser());
app.use(express.logger());

mongoose.connect('mongodb://localhost/test');


var UserModel = require('./models/user');
var TagModel  = require('./models/tag');
var ImgModel  = require('./models/img');


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



//AUTH
app.all('/api/img/*', function(req, res, next){
	req.datar={};
	_.extend(req.datar, req.query, req.body, {params:req.params});
	console.log(req.datar);
	if(!req.datar.uuid)   res.send({error: "Missing user id."});
	if(!req.datar.secret) res.send({error: "Missing password."});
	next();
}, UserModel.authenticate);


//IMG grabber
app.param('imghash', function(req, res, next, imghash){
	console.log(req.datar.params);
	var all = !!req.datar.params[0].match(/\/all/);
	req.all = all;
	console.log("all? "+all);
	if(all){
		ImgModel.find({
			hash_id: imghash,
		}, function(err, img){
			if (err) {
				next(err);
			} else if (img !==[]) {
				console.log("setting with");
				console.log(img);
				req.img = img;
				next();
			} else {
				next(new Error('Failed to load image'));
			}
		});
	}else{
		UserModel.findOne({uuid: req.datar.uuid},function(err, user){
			if(err) res.send({error: err});
			ImgModel.findOne({
				hash_id : req.datar.imghash,
				user    : user.uuid
			}, function(err, img){
				if (err) {
					next(err);
				} else if (img) {
					console.log("setting with");
					console.log(img);
					req.img = img;
					next();
				} else {
					next(new Error('Failed to load image'));
				}
			});
		});
	}
});


app.get('/api/img/:imghash', function(req, res){
	console.log("second lvl");
	console.log(req.img);
	console.log(req.params);
	if(req.img !== []){
		res.send(req.img);
	}else{
		res.send("no data"); //no data for file
	}
});

app.post('/api/img/:imghash', function(req, res){
	if(req.img !== []){//update
		console.log(req.img);
		console.log(req.datar);
		_.extend(req.img, req.datar);
		console.log(req.img);
		ImgModel.update({ hash_id: req.img.imghash },req.datar, function(err){
			if(err) res.send({error: err});
			res.send(req.img);
		});
	}else{//insert
		var img = new ImgModel(req.datar);
		img.save(function(err){
			if(err) res.send({error: err});
			res.send(img);
		});
	}
});

/*app.param('img', function(req, res, next, id){
  UserModel.authenticate(req, function(user){

  });
  UserModel.findOne(, function(err, user){
    if (err) {
      next(err);
    } else if (user) {
      req.user = user;
      next();
    } else {
      next(new Error('failed to load user'));
    }
  });
});*/


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

	http.createServer(app).listen(3000);

	https.createServer({
		key:  fs.readFileSync('certs/ssl-key.pem'),
		cert: fs.readFileSync('certs/ssl-cert.pem'),
	}, app).listen(3001);

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