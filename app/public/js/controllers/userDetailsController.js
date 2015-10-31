angular.module("app")
	.controller("UserDetailsController", ["Users","security","$location","$scope","$localStorage", function(users, security, $location, $scope, $localStorage) {

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
				if(error.status === 400) {
					$location.path('/login');
				}
			});
		}
	}]);
	