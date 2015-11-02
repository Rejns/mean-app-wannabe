angular.module("app")
	.controller("HeaderController", ["$scope", "security","$localStorage","$location","Users", function($scope, security, $localStorage, $location, users) {
		
		$scope.appName = "My awesome app";
		$scope.security = security;
		$scope.logout = logout;
		$scope.isAdmin = false;

		$scope.$watch('security.isAuthenticated()', function(val) {
			$scope.loggedIn = val;
			var user = security.getCurrentUser();
			if(user !== null)
				users.getOne(user).then(function(response) {
					if(response.data.access === "admin") 
							$scope.isAdmin = true;
				});
		});

		$scope.$watch(function() { 
			return security.getCurrentUser();
		}, function(user) {
			$scope.user = user;
		});

		function logout() {
			$scope.isAdmin = false;
			$localStorage.token = null;
			$localStorage.user = null;
		}

	}]);