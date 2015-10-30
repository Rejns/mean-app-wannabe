angular.module("app")
	.factory("Users", function($http) {
		return {
			getAll: function() {
				return $http.get('/api/users');
			},
			getOne: function(username) {
				return $http.get('/api/users/'+username);
			}
		}
	});