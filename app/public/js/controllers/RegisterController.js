angular.module("app")
	.controller("RegisterController", ["$scope","User", function($scope, User) {	
		$scope.username = "username";
		$scope.password = "password";

		$scope.register = function() {
			User.save({}, { username: $scope.username, password : $scope.password}, 
				function(response) {
					$scope.message = "Registration successful";
				}, function(error) {
					$scope.message = "Registration failed";
				});
		}
	}]);