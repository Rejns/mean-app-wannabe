angular.module("app")
	.controller("HomeController", ["security", "$localStorage", function(security, $localStorage) {
		if($localStorage.user === null)
			security.setCurrentUser();
	}]);