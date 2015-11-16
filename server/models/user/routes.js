var express = require('express');
var jwt = require('jsonwebtoken');
var User = require('./usermodel');

//create router instance
var router = express.Router();

//resolve login request
router.use(checkIfReqIsLoginReq);

//apply token authentication for all other routes
router.use(checkAuthentication);

//we use checkUserAuthorization middleware only for this route
router.get('/:user', checkUserAuthorization, function(req, res) {
	User.findOne({ 'username': req.params.user }, function (err, user) {
		res.json(user);
	});	
});

//apply admin permissions for next routes
router.use(checkAdminAuthorization);

router.get('/', function(req, res) {
	User.paginate({}, req.query.page, req.query.limit, function(err, pageCount, users, itemCount) {
		res.json({ users: users, pageCount: pageCount });
	});
});

router.post('/', function(req, res) {
	console.log("wrong");
	var user = new User({ 
		username : req.body.username,
		password : req.body.password,
	 	access   : req.body.access
	 });

	user.save(function(err, user) {
		if(user)
			res.json(user);
		else
			res.json(error);
	});
});

router.delete('/:user', function(req, res) {
	User.remove({ username: req.params.user }, function(err, deleted) {
		if(!err) {
			res.json(deleted);
		}
		else
			res.json(error);
	});
});

//function used in middleware that checks if user is authenticated (has token)
function checkAuthentication(req, res, next) {
	if(req.headers.authorization === undefined) 
		res.sendStatus(400);
	else
		next();
}

//function used in middlware that checks if user has admin permissions
function checkAdminAuthorization(req, res, next) {
	var token = req.headers.authorization.split(' ')[1];
	jwt.verify(token, 'secret', function(err, decoded) {
		if(err) 
			res.send(err.message);
		else if(decoded.access !== "admin") 
			res.sendStatus(401);
		else 
			next();
	});
	
}

//check if request is login request and then respond with a token
function checkIfReqIsLoginReq(req, res, next) {
		if(Object.keys(req.body).length == 2)
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
	else
		next();
}

//check if requested username is the same as username written in token, when returning a profile for user
function checkUserAuthorization(req, res, next) {
	var token = req.headers.authorization.split(' ')[1];
	jwt.verify(token, 'secret', function(err, decoded) {
		if(err) 
			res.send(err.message);
		else if(decoded.user !== req.params.user)
			res.sendStatus(401);
		else
			next();
	});
}

//return the router instance
module.exports = router;