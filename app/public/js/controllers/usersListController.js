angular.module("app")
	.controller("UsersListController", ["$scope", "Users", "security","$location","$localStorage", function($scope, users, security, $location, $localStorage){
		
		$scope.authError = true;
		$scope.loading = true;
		var initialWatch = true;

		$scope.$watch(function() {	
			return !!$localStorage.token;
		}, function(hasToken, oldv) {
			if(hasToken === false && !initialWatch && $location.path() === '/users-list')  
				$location.path('/login');
			initialWatch = false;
		});

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