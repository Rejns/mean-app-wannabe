angular.module("app")
	.controller("CreateUserController", ["$scope","$localStorage","$location","Users","security", function($scope, $localStorage, $location, users, security) {
		
		$scope.username = "new username";
		$scope.password = "new password";
		$scope.access = "access";
		$scope.add = add;
		$scope.isAdmin = false;

		var initialWatch = true;

		$scope.$watch(function() {	
			return !!$localStorage.token;
		}, function(hasToken, oldv) {
			if(hasToken === false && !initialWatch && $location.path() === '/create-user')  
				$location.path('/login');
			initialWatch = false;
		});

		$scope.loading = false;

		if(security.isAdmin())
			$scope.isAdmin = true;
		else
			$scope.errorMessage = "unauthorized access";

		function add() {
			$scope.successMessage = "";
			$scope.loading = true;
			users.create($scope.username, $scope.password, $scope.access)
				.then(function(response) {
					$scope.loading = false;
					$scope.successMessage = response.data.username+" added to database";
				}, function(error) {
					$scope.loading = false;
					if(error.status === 401) {
						$scope.errorMessage = "unauthorized access";
					}
				});	
		}
		

	}]);