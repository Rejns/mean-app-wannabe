angular.module("app")
	.controller("CreateUserController", ["$scope","$localStorage","$location", function($scope, $localStorage, $location) {
		
		$scope.username = "new username";
		$scope.password = "new password";
		$scope.access = "access";

		var initialWatch = true;

		$scope.$watch(function() {	
			return !!$localStorage.token;
		}, function(hasToken, oldv) {
			if(hasToken === false && !initialWatch && $location.path() === '/create-user')  
				$location.path('/login');
			initialWatch = false;
		});

	}]);