angular.module("app")
	.controller("UsersListController", ["$scope", "Users", "security","$location", function($scope, users, security, $location){
		$scope.authError = true;
		$scope.loading = true;

		if(!security.isAuthenticated())
			$location.path('/login');
		else
			$scope.loading = true;
			users.getAll().then(function(response){
				$scope.authError = false;
				$scope.users = response.data;
				$scope.loading = false;
			}, function(error) {
				$scope.loading = false;
				if(error.status === 401)
					$scope.errorMessage = "Unauthorized access";
				if(error.status === 400)
					$location.path('/login');
			});
	}]);