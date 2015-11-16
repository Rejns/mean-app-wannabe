var express = require('express');
var jwt = require('jsonwebtoken');
var User = require('./usermodel');
var security = require('../../security/security');

//create router instance
var router = express.Router();

//resolve register and login requests in middleware because route '/' is also used in admin section
//we must distingush between post requests (creating user, login, register) to the same route 
//angular utilizes $resouce object
//if certain middleware handler matches type of request it process the requests
//otherwise passes request to the next middleware
router.use(handleLoginRequest);
router.use(handleRegisterRequest); 

//apply token authentication for all other routes
router.use(security.checkAuthentication);

//we use checkUserAuthorization middleware only for this route
router.get('/:user', security.checkUserAuthorization, function(req, res) {
	User.findOne({ 'username': req.params.user }, function (err, user) {
		res.json(user);
	});	
});

//apply admin permissions for next routes
router.use(security.checkAdminAuthorization);

router.get('/', function(req, res) {
	User.paginate({}, req.query.page, req.query.limit, function(err, pageCount, users, itemCount) {
		res.json({ users: users, pageCount: pageCount });
	});
});

router.post('/', function(req, res) {
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


//check if request is login request and then respond with a token
function handleLoginRequest(req, res, next) {
		if(req.body.type === "login") 
			User.findOne({ 'username': req.body.username }, function (err, user) {
				if(user === null) 
					res.sendStatus(400);
				else 
					user.comparePassword(req.body.password, function(match) { 
						if(match) {
							var token = jwt.sign({ access: user.access, user: user.username }, 'secret');
							res.json({ token: token, user: user.username, access: user.access });
						}
						else
							res.sendStatus(401);
					}); 	
					
			});
		else
			next();
}

function handleRegisterRequest(req, res, next) {

	if(req.body.type === "register") {
		var user = new User({ 
			username : req.body.username,
			password : req.body.password,
		 	access   : "user"
		});

		user.save(function(err, user) {
			if(user)
				res.json(user);
			else
				res.json(error);
		});
	}
	else
		next();
}

//return the router instance
module.exports = router;