angular.module("app")
	.factory("Posts", ["$resource", function($resource) {
		return $resource('/api/posts/:postId', {}, {});
	}]);