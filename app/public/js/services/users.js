angular.module("app")
	.factory("User", ["$resource", function($resource) {
    	return $resource("/api/users/:user", { username: '@user'}, { 'query': {method : 'GET', isArray: false}});
  }]);