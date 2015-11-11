angular.module("app")
	.factory("Posts", function($http) {
		return {
			getAll: function(page, limit) {
				var config = { url: '/api/posts',method: 'GET', params: { page: page, limit: limit }}
				return $http(config);
			},
			create: function(username, message) {
				return $http.post('/api/posts/create', { author: username, message: message });
			},
			delete: function(id) {
				return $http.delete('/api/posts/delete/'+id);
			}	
		}
	});