var express = require('express');
var jwt = require('jsonwebtoken');
var Post = require('./postmodel');

//create router instance
var router = express.Router();

router.get('/', function(req, res) {
	Post.paginate({}, req.query.page, req.query.limit, function(err, pageCount, posts, itemCount){
		 Post.paginate({}, pageCount - req.query.page+1, req.query.limit, function(err, pageCount, posts, itemCount) {
		 	if(err)
		 		console.log(err);
		 	res.json(posts);
		 });
	});
});

//apply token check for all next routes
router.use(checkAuthentication)

//apply checkUserAuthorization middleware to confirm user
router.post('/', checkUserAuthorization, function(req, res) {
	var post = new Post({
		author: req.body.author,
		message: req.body.message,
		created: new Date()
	});

	post.save(function(err, post) {
		if(!err) {
			res.json(post);
		}
	});
});

router.delete('/:id', checkAdminAuthorization, function(req, res) {
	Post.remove({_id:req.params.id}, function(error, deleted) {
		if(!error) {
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

//check if user has admin permissions
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

module.exports = router;