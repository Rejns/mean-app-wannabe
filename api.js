var express = require('express');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

db = mongoose.connect("rejns:a1s2d3f4@ds045604.mongolab.com:45604/app-data");
var Schema = mongoose.Schema;
var User = new Schema({
  username    : String,
  password	  : String,
  access	  : String
}, {collection: 'users'});
mongoose.model('User', User);
var User = mongoose.model('User');

var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/app/public'));

app.post('/api/authenticate', function(req, res) {	
	User.findOne({ 'username': req.body.username }, function (err, user) {
  		if(user === null) 
  			res.sendStatus(400);
  		else if(user.password === req.body.password) {
  			var token = jwt.sign({ access: user.access, user: user.username }, 'secret');
  			res.json({ token: token, user: user.username });
  		}
  		else
  			res.sendStatus(401);
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

app.post('/api/create', function(req, res) {
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

app.delete('/api/delete/:user', function(req, res) {
	console.log(req.body);
	if(req.headers.authorization !== undefined) {
		var token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, 'secret', function(err, decoded) {
			if(decoded.access === "admin" && decoded.username !== req.params.user) { //admin cannot delete himself
				User.remove({ username: req.params.user }, function(error, deleted) {
					if(!err) {
						console.log(deleted);
						//res.json(deleted);
					}
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

function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
}

app.get('/api/users', function(req, res) {
	if(req.headers.authorization !== undefined) {
		var token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, 'secret', function(err, decoded) {
			if(err) {
				res.send(err.message);
			}
			else {
				if(decoded.access === "admin") {
					User.find(function(err, users) {
						var indexOfCurrent = findWithAttr(users, 'username', decoded.username);
						users.splice(indexOfCurrent,1);
						res.json(users);
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

app.get('/', function(req, res) {
	res.sendFile(__dirname+'/app/index.html');
});

app.listen(3000);