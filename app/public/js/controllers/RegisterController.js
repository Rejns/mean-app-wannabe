angular.module("app")
	.controller("RegisterController", ["$scope","Users", function($scope, users) {
		$scope.username = "username";
		$scope.password = "password";
		$scope.register = register;

		function register() {
			users.register($scope.username, $scope.password)
				.then(function(response) {
					$scope.message = "Registration successful";
				}, function(error) {
					$scope.message = "Registration failed";
				});
		}
	}]);