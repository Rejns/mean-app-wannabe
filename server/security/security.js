//security module
//it provides security middleware
var jwt = require('jsonwebtoken');

//function used in middleware that checks if user is authenticated (has token)
function checkAuthentication(req, res, next) {
	if(req.headers.authorization === undefined) 
		res.sendStatus(400);
	else
		next();
}

//check if user has permission to submit this post
function checkUserAuthorization(req, res, next) {
	var token = req.headers.authorization.split(' ')[1];
	jwt.verify(token, 'secret', function(err, decoded) {
		if(decoded.username !== req.body.username)
			res.sendStatus(401);
		else 
			next();	
	});
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

var security = {
	checkAuthentication:checkAuthentication,
	checkUserAuthorization:checkUserAuthorization,
	checkAdminAuthorization:checkAdminAuthorization	
}

module.exports = security;