angular.module("app")
	.factory("Users", function($http) {
		return {
			getAll: function() {
				return $http.get('/api/data');
			}
		}
	});