var express = require('express');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

console.log(__dirname);
app.use(bodyParser.json());
app.use(express.static(__dirname+'/app/public'));

db = mongoose.connect("rejns:a1s2d3f4@ds045604.mongolab.com:45604/app-data");
var Schema = mongoose.Schema;
var User = new Schema({
  username    : String,
  password	  : String,
  access	  : String
}, {collection: 'users'});
mongoose.model('User', User);
var User = mongoose.model('User');

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
	var token = req.headers.authorization.split(' ')[1];
	jwt.verify(token, 'secret', function(err, decoded) {
		if(decoded.user !== req.params.user)
			res.sendStatus(401);
		else if(!err) 
			User.findOne({ 'username': req.params.user }, function (err, user) {
				res.json(user);
			});
	});
});

app.get('/api/users', function(req, res) {
	var token = req.headers.authorization.split(' ')[1];
	jwt.verify(token, 'secret', function(err, decoded) {
		if(err) {
			res.send(err.message);
		}
		else {
			if(decoded.access === "admin") {
				User.find(function(err, users) {
					res.json(users);
				});
			}
			else
				res.json([]);
		}
	});
	
});

app.get('/', function(req, res) {
	res.sendFile(__dirname+'/app/index.html');
});

app.listen(3000);