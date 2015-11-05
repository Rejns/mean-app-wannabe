angular.module("app")
	.controller("UsersListController", ["$scope", "Users", "security","$location","$localStorage", function($scope, users, security, $location, $localStorage){
		
		$scope.authError = true;
		$scope.loading = false;
		$scope.isAdmin = false;
		var initialWatch = true;

		$scope.$watch(function() {	
			return !!$localStorage.token;
		}, function(hasToken, oldv) {
			if(hasToken === false && !initialWatch && $location.path() === '/users-list')  
				$location.path('/login');
			initialWatch = false;
		});

		console.log($localStorage.access);
		console.log(security.isAdmin());

		if(security.isAdmin()) {
				$scope.isAdmin = true;
				$scope.loading = true;
				users.getAll().then(function(response){
					$scope.authError = false;
					$scope.users = response.data;
					$scope.loading = false;
				});
		}
		else 
			$scope.errorMessage = "unauthorized access";
	}]);