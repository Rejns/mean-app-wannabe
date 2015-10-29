var express = require('express');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

app.use(bodyParser.json());
app.use('/js', express.static(__dirname+'/app/js'));
app.use('/view', express.static(__dirname+'/app/views'));

db = mongoose.connect("rejns:a1s2d3f4@ds045604.mongolab.com:45604/app-data");
var Schema = mongoose.Schema;

var User = new Schema({
  username    : String,
  password	  : String
}, {collection: 'users'});

mongoose.model('User', User);
var User = mongoose.model('User');

var token = jwt.sign({data:"lala"},'secret');

app.post('/api/authenticate', function(req, res) {	
	User.findOne({ 'username': req.body.username }, function (err, user) {
  		if(user === null) 
  			res.send("Username incorrect");
  		else if(user.password === req.body.password)
  			res.json({ token: token });
  		else
  			res.send("password incorrect");
	});
});

app.get('/api/data', function(req, res) {
	var token = req.headers.authorization.split(' ')[1];
	jwt.verify(token, 'secret', function(err, decoded) {
		if(err) {
			res.send(err);
		}
		else {
			res.send("data");
		}
	});
	
});

app.get('/*', function(req, res) {
	
	res.sendFile(__dirname+'/app/index.html');
});

app.listen(3000);