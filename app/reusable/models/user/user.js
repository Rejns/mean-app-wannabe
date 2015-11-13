angular.module("user", ["ngResource"])
	.factory("User", ["$resource", function($resource) {
    	return $resource("/api/users/:user", {}, { 'query': {method : 'GET', isArray: false}});
  }]);