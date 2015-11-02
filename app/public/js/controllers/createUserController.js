angular.module("app")
	.controller("CreateUserController", ["$scope","$localStorage","$location","Users", function($scope, $localStorage, $location, users) {
		
		$scope.username = "new username";
		$scope.password = "new password";
		$scope.access = "access";
		$scope.add = add;

		var initialWatch = true;

		$scope.$watch(function() {	
			return !!$localStorage.token;
		}, function(hasToken, oldv) {
			if(hasToken === false && !initialWatch && $location.path() === '/create-user')  
				$location.path('/login');
			initialWatch = false;
		});

		$scope.loading = false;

		function add() {
			$scope.loading = true;
			users.create($scope.username, $scope.password, $scope.access)
				.then(function(response) {
					$scope.loading = false;
					console.log(response);
				}, function(error) {
					console.log(error);
				});	
		}
		

	}]);