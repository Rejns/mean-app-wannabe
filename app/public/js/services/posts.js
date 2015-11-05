angular.module("app")
	.factory("Posts", function($http) {
		return {
			getAll: function() {
				return $http.get('/api/posts');
			},
			create: function(username, message) {
				return $http.post('/api/posts/create', { author: username, message: message });
			},
			delete: function(id) {
				return $http.delete('/api/posts/delete/'+id);
			}	
		}
	});