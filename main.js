var express  = require('express');
var params   = require('express-params');
var mongoose = require('mongoose');
var https    = require('https');
var http     = require('http');
var fs       = require('fs');
var _        = require('underscore');

var UserModel = require('./models/user');
//var TagModel  = require('./models/tag');
var ImgModel  = require('./models/img');

var app = express();
app.use(express.bodyParser()); 	//autoparse POST request bodies
app.use(express.logger());		//auto request logger

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, {error: err});
});
// app.use(pre_auth);				//run the pre-auth command before all requests
// app.use(UserModel.authenticate);

app.use(app.router);

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/mydb';

mongoose.connect(mongoUri);


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


//IMG grabber
app.param('imghash',  function (req, res, next, imghash){
	console.log(req.rData);
	req.hash_id = imghash;
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
		var tag_count = (req.rData.tags? req.rData.tags : 20);
		ImgModel.find({hash_id: imghash}, function (err, results){
			if(results.length==0){
				req.img=undefined;
				next();
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
			next();
		});
	}else{
		console.log("single");
		UserModel.findOne({uuid: req.rData.uuid},function (err, user){
			console.log(user);
			ImgModel.findOne({
				hash_id : imghash,
				user    : user._id
			}, function (err, img){
				if (err) {
					console.log(err);
					next(err);
				} else if (img) {
					console.log("setting with");
					console.log(img);
					req.img = img;
					next();
				} else {
					console.log("item not found");
					req.img=undefined;
					next();
				}
			});
		});
	}
});

/*app.all('/api/*', pre_auth, UserModel.authenticate, function (req,res,next){
	next();
});*/

//AUTH
/*app.all('/api/img/*', function (req, res, next){
	req.rData={};
	_.extend(req.rData, req.query, req.body, {params:req.params});
	console.log(req.rData);
	if(!req.rData.uuid)   res.send(500, {error: "Missing user id."});
	if(!req.rData.secret) res.send(500, {error: "Missing password."});
	var all = !!req.rData.params[0].match(/\/all/);
	req.all = all;
	if(all)
		req.url = req.url.replace(/\/all/,'').replace(/\/img/,'\/img_all'); //rewrite
	next();
}, UserModel.authenticate);*/
function pre_auth(req,res,next){
	req.rData={};
	_.extend(req.rData, req.query, req.body, {params:req.params});
	console.log(req.rData);
	if(!req.rData.uuid)   res.send(500, {error: "Missing user id."});
	if(!req.rData.secret) res.send(500, {error: "Missing password."});
	if(!req.rData.params) req.rData.params = [''];
	var all = !!req.path.match(/\/all/);
	req.all = all;
	if(all){
		req.url = req.url.replace(/\/all/,'').replace(/\/img/,'\/img_all'); //rewrite
		console.log("rewrite: "+req.url);
	}
	next();
}

app.get('/api/img/:imghash', function (req, res){
	console.log("image "+req.hash_id+" requested.");
	console.log(req.img);
	res.send(req.img);
});

app.get('/api/img_all/:imghash', function (req, res){
	res.send(req.img);
});

app.post('/api/img/:imghash', function (req, res){
	console.log("POST");
	console.log(req.img);

	if(!req.img){
		req.img = new ImgModel({
			hash_id : req.hash_id.toLowerCase(),
			user    : req.user_id,
			rating  : req.rData.rating,
			tags    : (req.rData.tags 	? req.rData.tags.substr(1).split("#")
										: undefined),
		});
	}else{
		if(req.rData.rating) req.img.rating = req.rData.rating;
		if(req.rData.tags) req.img.tags = _.union(req.img.tags,req.rData.tags.substr(1).split("#"));
	}
	req.img.save(function (err){
		console.log(req.img);
		res.send(req.img);
		console.log("done.");
	});

	/*if(req.img){	//update
		console.log("updating");
		console.log(req.img);
		console.log(req.rData);
		console.log(req.img);
		ImgModel.update({
			hash_id: req.img.hash_id                                                                                    
		}, {
			rating : req.rData.rating,
			tags   : (req.rData.tags ? req.rData.tags.substr(1).split("#")
									 : undefined),
		}, function(err){
			res.send(req.img);
		});
	}else{				//insert
		console.log("inserting");
		var img = new ImgModel({
			hash_id : req.hash_id.toLowerCase(),
			user    : req.user_id,
			rating  : req.rData.rating,
			tags    : (req.rData.tags 	? req.rData.tags.substr(1).split("#")
										: undefined),
		});
		img.save(function (err){
			res.send(img);
		});
		/*ImgModel.insert({
			hash_id : req.hash_id,
			user    : req.user_id,
			rating  : req.rData.rating,
			tags    : (req.rData.tags 	? req.rData.tags.substr(1).split("#")
										: undefined),
		},function (err){
			res.send(img);
		});*/
	//}
});


/*app.all('*', function (req, res, next) {
	console.log("CATCH");
	console.log(req.route);
	console.log(app.routes.post[1].regexp);
	console.log(">"+req.path+"<");
	console.log(req.path.match(app.routes.post[1].regexp));
	console.log(req.img);
	next();
});*/


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

	console.log(app.routes);

	var port = Number(process.env.PORT || 5000);
	http.createServer(app).listen(port);
	console.log("Listening on port "+port);
	/*https.createServer({
		key:  fs.readFileSync('certs/ssl-key.pem'),
		cert: fs.readFileSync('certs/ssl-cert.pem'),
	}, app).listen(3001);*/
});


function generate_hash(){
	var hash = CryptoJS.MD5("Message");
}