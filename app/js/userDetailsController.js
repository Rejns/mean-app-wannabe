angular.module("app")
	.controller("UserDetailsController", ["Users", "$window","security","$location", function(users, $window, security, $location) {
		if(!security.isAuthenticated())
			$location.path('/login');

	}]);
	