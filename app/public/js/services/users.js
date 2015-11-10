angular.module("app")
	.factory("Users", function($http) {
		return {
			getAll: function() {
				var config = { method: 'GET', url: '/api/users', params : { page: 2, limit: 10 }};
				return $http(config);
			},
			getOne: function(username) {
				return $http.get('/api/users/'+username);
			},
			create: function(username, password, access) {
				return $http.post('/api/create', { username: username, password: password, access: access });
			},
			delete: function(username) { 
				return $http.delete('/api/delete/'+username); //is data is sent in body it does not work
			},
			register: function(username, password) {
				return $http.post('/api/register', { username: username, password: password});
			}
		}
	})
	.factory("User", ["$resource", function($resource) {
    return $resource("/api/users", {}, { 'query': {method : 'GET', isArray: false}});
  }]);