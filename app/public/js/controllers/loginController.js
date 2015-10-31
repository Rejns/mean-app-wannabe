angular.module("app")
	.controller("LoginController", ["$scope", "security", "Users", "$location","$localStorage", function($scope, security, users, $location, $localStorage) {
		if(security.isAuthenticated() && $localStorage.token !== null)
			$location.path('/home');

		$scope.username ="username";
		$scope.password ="password";
		$scope.login = login;
		$scope.loading = false;

		function login() {
			$scope.loading = true;
			security.login($scope.username, $scope.password)
			.then(function(){
				if(security.getCurrentUser() !== null) {
					$scope.loading = false;
					var user = security.getCurrentUser();
					$location.path('/user-details/'+user);
				}
			}, function(error) {
				if(error.status === 400) {
					$scope.loading = false;
					$scope.errorMessage  = "Username does not exist!";
				}
				if(error.status === 401) {
					$scope.loading = false;
					$scope.errorMessage = "Invalid password!";
				}
			});
		}
	}]);