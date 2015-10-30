angular.module("app")
	.controller("UserDetailsController", ["Users", "$window","security","$location","$scope", function(users, $window, security, $location, $scope) {
		if(!security.isAuthenticated())
			$location.path('/login');
		else {
			var user = security.getCurrentUser();
			$scope.isAdmin = false;
			
			users.getOne(user).then(function(response){
				$scope.username = response.data.username;
				$scope.access = response.data.access;
				if($scope.access === "admin") {
					users.getAll().then(function(response){
						$scope.users = response.data;
						$scope.isAdmin = true;
					});
				}
			}, function(error) {
				if(error.status === 401)
					$scope.errorMessage = "Unauthorized access!";
			});
		}
	}]);
	