var express = require('express');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var mongoose = require('mongoose-paginate');
var paginate = require('express-paginate');
var app = express();
 


db = mongoose.connect("rejns:a1s2d3f4@ds045604.mongolab.com:45604/app-data");
var Schema = mongoose.Schema;
var User = new Schema({
  username    : String,
  password	  : String,
  access	  : String,
}, {collection: 'users'});
mongoose.model('User', User);
var User = mongoose.model('User');


var Post = new Schema({
	author: String,
	message: String,
	created: Date

}, {collection: 'posts'});
mongoose.model('Post',Post);
var Post = mongoose.model('Post');


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/app/public'));
app.use(paginate.middleware(10, 50));

app.post('/api/authenticate', function(req, res) {	
	User.findOne({ 'username': req.body.username }, function (err, user) {
  		if(user === null) 
  			res.sendStatus(400);
  		else if(user.password === req.body.password) {
  			var token = jwt.sign({ access: user.access, user: user.username }, 'secret');
  			res.json({ token: token, user: user.username, access: user.access });
  		}
  		else
  			res.sendStatus(401);
	});
});

app.post('/api/users', function(req, res) {
	var user = new User({
			username: req.body.username,
			password: req.body.password,
			access: "user"
		});

	User.create(user, function(err, user) {
		if(user)
			res.json(user);
		else
			res.json(error);
	});
});

app.get('/api/users/:user', function(req, res) {
	if(req.headers.authorization !== undefined) {
		var token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, 'secret', function(err, decoded) {
			if(decoded === undefined)
				res.sendStatus(400);
			else if(decoded.user !== req.params.user)
				res.sendStatus(401);
			else if(!err) 
				User.findOne({ 'username': req.params.user }, function (err, user) {
					res.json(user);
				});
		});
	}
	else 
		res.sendStatus(400);
});

app.post('/api/users', function(req, res) {
	if(req.headers.authorization !== undefined) {
		var token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, 'secret', function(err, decoded) {
			if(decoded.access === "admin") {
				var user = new User({ 
					username : req.body.username,
					password : req.body.password,
				 	access   : req.body.access
				 });

				User.create(user, function(err, user) {
					if(user)
						res.json(user);
					else
						res.json(error);
				});
			}
			else
				res.sendStatus(401);
		});

	}
	else
		res.sendStatus(400);
});

app.delete('/api/users/:user', function(req, res) {
	if(req.headers.authorization !== undefined) {
		var token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, 'secret', function(err, decoded) {
			if(decoded.access === "admin" && decoded.username !== req.params.user) { //admin cannot delete himself
				User.remove({ username: req.params.user }, function(error, deleted) {
					if(!err) {
						res.json(deleted);
					}
					else
						res.json(error);
				});
			}
			else
				res.sendStatus(401);
		});

	}
	else
		res.sendStatus(400);
});

/*function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
}*/

app.get('/api/users', function(req, res) {
	if(req.headers.authorization !== undefined) {
		var token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, 'secret', function(err, decoded) {
			if(err) {
				res.send(err.message);
			}
			else {
				if(decoded.access === "admin") {
					User.paginate({}, req.query.page, req.query.limit, function(err, pageCount, users, itemCount) {
						res.json({ users: users, pageCount: pageCount });
						//var indexOfCurrent = findWithAttr(users, 'username', decoded.username);
						//users.splice(indexOfCurrent,1);
						
					});
			}
				else
					res.sendStatus(401);
			}
		});
	}
	else 
		res.sendStatus(400);
});

app.get('/api/posts', function(req, res) {
	Post.paginate({}, req.query.page, req.query.limit, function(err, pageCount, posts, itemCount){
		 var pageCount = pageCount;
		 Post.paginate({}, pageCount - req.query.page+1, req.query.limit, function(err, pageCount, posts, itemCount) {
		 	var posts = posts;
		 	res.json(posts);
		 });
	});
});

app.post('/api/posts', function(req, res) {
	if(req.headers.authorization !== undefined) {
		var token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, 'secret', function(err, decoded) {
			if(decoded.username === req.body.username) {
				var post = new Post({
					author: req.body.author,
					message: req.body.message,
					created: new Date()
				});

				Post.create(post, function(err, post) {
					if(!err) {
						res.json(post);
					}
				});
			}
			else
				res.sendStatus(401);
		});
	}
	else
		res.sendStatus(400);
});

app.delete('/api/posts/:id', function(req, res) {
	if(req.headers.authorization !== undefined) {
		var token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, 'secret', function(err, decoded) {
			if(decoded.access === "admin") {
				Post.remove({_id:req.params.id}, function(error, deleted) {
					if(!err) {
						res.json(deleted);
					}
					else
						res.json(err);
				});
			}
			else
				res.sendStatus(401);
		});
	}
	else
		res.sendStatus(400);
});


app.get('/', function(req, res) {
	res.sendFile(__dirname+'/app/index.html');
});

app.listen(3000);