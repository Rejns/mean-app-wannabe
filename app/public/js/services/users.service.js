angular.module("app")
	.factory("Users", function($http) {
		return {
			getAll: function() {
				return $http.get('/api/users');
			},
			getOne: function(username) {
				return $http.get('/api/users/'+username);
			},
			create: function(username, password, access) {
				return $http.post('/api/create', { username: username, password: password, access: access });
			},
			delete: function(username) { 
				return $http.delete('/api/delete/'+username); //is data is sent in body it does not work
			}
		}
	});