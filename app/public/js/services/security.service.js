angular.module("app")
	.service("security", ["$http", "$localStorage","$q","$rootScope", function($http, $localStorage, $q, $rootScope) {

		var currentUser = $localStorage.user || null;
		var initialWatch = true;
		
		$rootScope.$watch(
		function() {
			return $localStorage.user;
		}, 
		function(newv, oldv) {	
			if(!initialWatch)  
				currentUser = newv;
			initialWatch = false;
		});

		this.login = function(username, password) {
			var deferred = $q.defer();
			$http.post("/api/authenticate", { username: username, password: password })
				.then(function(response) {
					if(response.data.token !== 'undefined') {
						$localStorage.token = response.data.token;
						$localStorage.user = response.data.user;
					    currentUser = response.data.user;
						deferred.resolve(response);
					}
				}, function(error) {
					deferred.reject(error);
				});
			return deferred.promise; 
		}

		this.isAuthenticated = function() {
			return !!currentUser;			
		}

		this.getCurrentUser = function() {
			return currentUser;
		}

		this.setCurrentUser = function() {
			currentUser = null;
		}
	}]);