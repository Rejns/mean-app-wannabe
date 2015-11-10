angular.module("app")
	.controller("UsersListController", ["$scope", "Users", "security","$location","$localStorage","User", function($scope, users, security, $location, $localStorage, User){
		
		$scope.authError = true;
		$scope.loading = false;
		$scope.isAdmin = false;
		var initialWatch = true;
		$scope.list = [];
		$scope.user = User;
		$scope.results = { options: [ {value: 5}, { value: 10}, {value: 20}, {value:50}], selected: {value: 50}};
		$scope.numPages = 5;
		//$scope.paginator = { options : [ { value: 3 }, {value: 5}, { value:10 } ], selected: { value: 3 } };
		
		/*$scope.$watch(function() {
			return $scope.paginator.selected.value;
		}, function(val) {
			$scope.numPages = val;
		});*/

		/*$scope.$watch(function() {
			return $scope.results.selected.value;
		}, function(val) {
			$scope.noOfResults = val;
		});*/

		$scope.$watch(function() {	
			return !!$localStorage.token;
		}, function(hasToken, oldv) {
			if(hasToken === false && !initialWatch && $location.path() === '/users-list')  
				$location.path('/login');
			initialWatch = false;
		});

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