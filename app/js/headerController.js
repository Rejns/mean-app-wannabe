angular.module("app")
	.controller("HeaderController", ["$scope", "security","$window","$location", function($scope, security, $window, $location) {
		$scope.appName = "My awesome app";
		$scope.security = security;
		$scope.logout = logout;

		$scope.$watch('security.isAuthenticated()', function(val) {
			$scope.loggedIn = val;
		});
		$scope.$watch('security.getCurrentUser()', function(user) {
			$scope.user = user;
		});

		function logout() {
			$window.localStorage.token = {};
			security.setCurrentUser();
		}
	}]);