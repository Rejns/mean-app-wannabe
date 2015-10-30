angular.module("app")
	.controller("UsersListController", ["$scope", "Users", "security","$location", function($scope, users, security, $location){
		$scope.authError = true;

		if(!security.isAuthenticated())
			$location.path('/login');
		else
			users.getAll().then(function(response){
				$scope.authError = false;
				$scope.users = response.data;
			}, function(error) {
				if(error.status === 401)
					$scope.errorMessage = "Unauthorized access";
			});
	}]);