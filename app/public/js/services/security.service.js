angular.module("app")
	.service("security", ["$http", "$window","$q", function($http, $window, $q) {

		var currentUser = $window.localStorage.user || null;
		
		this.login = function(username, password) {
			var deferred = $q.defer();
			$http.post("/api/authenticate", { username: username, password: password })
				.then(function(response) {
					if(response.data.token !== 'undefined') {
						$window.localStorage.token = response.data.token;
						$window.localStorage.user = response.data.user;
						currentUser = response.data.user;
						deferred.resolve(response);
					}
				}, function(error) {
					deferred.reject(error);
				});
			return deferred.promise; 
		}

		this.isAuthenticated = function() {
			if(currentUser !== null)
				return true;
			else
				return false;
		}

		this.getCurrentUser = function() {
			return currentUser;
		}

		this.setCurrentUser = function() {
			currentUser = null;
		}
	}]);