angular.module("app")
	.controller("HeaderController", ["$scope", "security","$window","$location","Users", function($scope, security, $window, $location, users) {
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
		$scope.$watch('security.getCurrentUser()', function(user) {
			$scope.user = user;
		});

		function logout() {
			$scope.isAdmin = false;
			$window.localStorage.token = {};
			security.setCurrentUser();
		}
	}]);