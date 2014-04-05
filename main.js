var express  = require('express');
var mongoose = require('mongoose');
var https    = require('https');
var http     = require('http');
var fs       = require('fs');
var _        = require('underscore');

var app = express();
app.use(express.bodyParser());
app.use(express.logger());
app.use(app.router);

mongoose.connect('mongodb://localhost/test');


var UserModel = require('./models/user');
//var TagModel  = require('./models/tag');
var ImgModel  = require('./models/img');


/*Methods (api.curiosadb.com/img/IMAGE-ID/)
{	user:uuid, secret:secret	} <- required for all queries
{	tags:int (default: top 20) } <- optional for get queries

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
app.all('/api/img/*', function (req, res, next){
	req.datar={};
	_.extend(req.datar, req.query, req.body, {params:req.params});
	console.log(req.datar);
	if(!req.datar.uuid)   res.send({error: "Missing user id."});
	if(!req.datar.secret) res.send({error: "Missing password."});
	var all = !!req.datar.params[0].match(/\/all/);
	req.all = all;
	if(all)
		req.url = req.url.replace(/\/all/,'').replace(/\/img/,'\/img_all'); //rewrite
	next();
}, UserModel.authenticate);


//IMG grabber
app.param('imghash', function (req, res, next, imghash){
	console.log(req.datar);
	if(req.all){
		/*ImgModel.aggregate({ //TODO something like this
			$sort: {},
			$group: {
				_id: "$hash_id",
				rating: {$avg: "$rating"},
			},
			$match: {
				hash_id: { $eq: imghash },
			}
		});*/
		console.log("aggragate");
		var tag_count = (req.datar.tags? req.datar.tags : 20);
		ImgModel.find({hash_id: imghash}, function (err, results){
			if(results.length==0){
				req.img={};
				next('route');
			}
			var ratings = _.reduce(results, function (memo,i,list){
					return memo+i.rating;
				},0) / results.length;

			var tags = _.chain(results)
				.map(function (e,i,a){
					return e.tags;
				})
				.flatten()
				.countBy(function (e){
					return e;
				})
				.pairs()
				.sortBy(function (e,i,a){
					return -1*e[1];
				})
				.reject(function (e,i,a){
					return i>tag_count-1;
				})
				.map(function (e,i,a){
					return e[0];
				})
				.value();

			req.img = {
				rating  : ratings,
				tags    : tags,
				hash_id : imghash,
			};
			next('route');
		});
	}else{
		console.log("single");
		UserModel.findOne({uuid: req.datar.uuid},function (err, user){
			if(err) res.send({error: err});
			console.log(user);
			ImgModel.findOne({
				hash_id : req.datar.imghash,
				user    : user._id
			}, function (err, img){
				if (err) {
					next(err);
				} else if (img) {
					console.log("setting with");
					console.log(img);
					req.img = img;
					next('route');
				} else {
					req.img={};
					next('route');
				}
			});
		});
	}
});

app.post('/api/img/:imghash', function (req, res){
	console.log("POST");
	if(req.img !== {}){	//update
		console.log("updating");
		console.log(req.img);
		console.log(req.datar);
		_.extend(req.img, req.datar);
		console.log(req.img);
		ImgModel.update({
			hash_id: req.img.hash_id
		}, req.datar, function(err){
			if(err) res.send({error: err});
			res.send(req.img);
		});
	}else{				//insert
		console.log("inserting");
		var img = new ImgModel(req.datar);
		img.save(function (err){
			if(err) res.send({error: err});
			res.send(img);
		});
	}
});

app.get('/api/img/:imghash', function (req, res){
	// console.log("second lvl");
	// console.log(req.img);
	// console.log(req.params);
	res.send(req.img);
});

app.get('/api/img_all/:imghash', function (req, res){
	// console.log("second lvl");
	// console.log(req.img);
	// console.log(req.params);
	res.send(req.img);
});

/*app.all('*', function (req, res, next) {
	console.log("CATCH");
	console.log(req.route);
	console.log(app.routes.post[1].regexp);
	console.log(">"+req.path+"<");
	console.log(req.path.match(app.routes.post[1].regexp));
	var p = req.path;
	var r = app.routes.post[1].regexp;
	console.log(p.match(r));
	next();
});*/


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

	console.log(app.routes);

	http.createServer(app).listen(3000);
	https.createServer({
		key:  fs.readFileSync('certs/ssl-key.pem'),
		cert: fs.readFileSync('certs/ssl-cert.pem'),
	}, app).listen(3001);
});