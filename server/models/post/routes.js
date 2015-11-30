var express = require('express');
var jwt = require('jsonwebtoken');
var Post = require('./postmodel');
var security = require('../../security/security');

//create router instance
var router = express.Router();

router.get('/', function(req, res) {
	console.log(req.query.page);
	Post.paginate({}, { page: req.query.page, limit: req.query.limit }, function(err, posts, pageCount, itemCount) {
		//check if requested page exists
		if((pageCount - req.query.page+1) > 0 &&  (pageCount - req.query.page+1) <= pageCount)
			Post.paginate({}, { page: pageCount - req.query.page+1, limit: req.query.limit, sortBy : { created: 1 } }, function(err, posts, pageCount, itemCount) {
			 	if(err)
			 		console.log(err);
			 	res.json(posts);
			});
	});
});

//apply token check for all next routes
router.use(security.checkAuthentication)


//apply checkUserAuthorization middleware to confirm user
router.post('/', security.checkUserAuthorization, function(req, res) {
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

router.delete('/:id', security.checkAdminAuthorization, function(req, res) {
	Post.remove({_id:req.params.id}, function(error, deleted) {
		if(!error) {
			res.json(deleted);
		}
		else
			res.json(error);
	});
});

module.exports = router;