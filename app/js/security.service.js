angular.module("app")
	.service("security", function($http) {
		
		this.login = function(username, password) {
			return $http.post("/api/authenticate", { username: username, password: password });
		}
	});