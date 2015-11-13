angular.module("header", ["security", "ngStorage"])
	.controller("HeaderController", ["$scope", "security","$localStorage","$location",function($scope, security, $localStorage, $location) {
		
		$scope.appName = "My awesome app";
		$scope.security = security;
		$scope.logout = logout;
		$scope.isAdmin = false;

		$scope.$watch('security.isAuthenticated()', function(val) {
			$scope.loggedIn = val;
			if(security.getCurrentUser() !== null && security.isAdmin())
				$scope.isAdmin = true;
				
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
			$localStorage.access = null;
		}

	}]);