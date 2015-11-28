angular.module("register", ["user", "ngRoute"])
	.config(function($routeProvider){
		$routeProvider
			.when('/register', {
				templateUrl: 'components/register/register.tpl.html',
				controller: 'RegisterController' 
			})
	})
	.controller("RegisterController", ["$scope","User", function($scope, User) {	
		$scope.username = "";
		$scope.password = "";

		$scope.register = function() {
			//also send type to distingiush between registering and creating user
			User.save({}, { username: $scope.username, password : $scope.password, type : "register" }, 
				function(response) {
					$scope.message = "Registration successful";
				}, function(error) {
					$scope.message = "Registration failed";
				});
		}
	}]);