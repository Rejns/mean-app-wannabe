angular.module("app")
	.controller("UserDetailsController", ["Users", "$window","security","$location","$scope", function(users, $window, security, $location, $scope) {
		if(!security.isAuthenticated())
			$location.path('/login');
		else {
			var user = security.getCurrentUser();
			users.getAll().then(function(response){
				$scope.users = response.data;
			});
			users.getOne(user).then(function(response){
				$scope.username = response.data.username;
				$scope.access = response.data.access;
			}, function(error) {
				if(error.status === 401)
					$scope.errorMessage = "Unauthorized access!";
			});
		}
	}]);
	