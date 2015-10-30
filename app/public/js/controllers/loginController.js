angular.module("app")
	.controller("LoginController", ["$scope", "security", "Users", "$location", function($scope, security, users, $location) {
		
		$scope.username ="username";
		$scope.password ="password";
		$scope.login = login;

		function login() {
			security.login($scope.username, $scope.password)
			.then(function(){
				if(security.getCurrentUser() !== null) {
					var user = security.getCurrentUser();
					$location.path('/user-details/'+user);
				}
			}, function(error) {
				if(error.status === 400) {
					$scope.errorMessage  = "Username does not exist!";
				}
				if(error.status === 401)
					$scope.errorMessage = "Invalid password!";
			});
		}

	}]);