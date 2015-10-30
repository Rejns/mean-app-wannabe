angular.module("app")
	.controller("UserDetailsController", ["Users", "$window","security","$location","$scope", function(users, $window, security, $location, $scope) {
		if(!security.isAuthenticated())
			$location.path('/login');
		else {
			var user = security.getCurrentUser();
			$scope.isAdmin = false;
			
			$scope.loading = true;
			users.getOne(user).then(function(response){
				$scope.username = response.data.username;
				$scope.access = response.data.access;
				$scope.loading = false;
			}, function(error) {
				$scope.loading = false;
				if(error.status === 401)
					$scope.errorMessage = "Unauthorized access!";
			});
		}
	}]);
	