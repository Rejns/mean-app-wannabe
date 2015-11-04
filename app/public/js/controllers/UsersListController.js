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

		$scope.loading1 = true;
		var user = security.getCurrentUser();
		users.getOne(user)
			.then(function(response) {
				if(response.data.access === "admin") {
						$scope.isAdmin = true;
						$scope.loading1 = false;
						$scope.loading = true;
						users.getAll().then(function(response){
							$scope.authError = false;
							$scope.users = response.data;
							$scope.loading = false;
						});
				}
				else {
					$scope.errorMessage = "unauthorized access";
					$scope.loading1 = false;
				}
			});
	}]);