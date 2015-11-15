angular.module("post", ["ngResource"])
	.factory("Posts", ["$resource", function($resource) {
		return $resource('/api/posts/:postId', {}, {});
	}]);