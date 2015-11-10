angular.module("app")
	.controller("UsersListController", ["$scope", "Users", "security","$location","$localStorage","User", function($scope, users, security, $location, $localStorage, User){
		
		$scope.isAdmin = false;
		var initialWatch = true;
		$scope.list = [];
		$scope.user = User;
		$scope.results = { options: [ {value: 5}, { value: 10}, {value: 20}, {value:50}], selected: {value: 10}};
		$scope.numPages = 5;


		$scope.$watch(function() {	
			return !!$localStorage.token;
		}, function(hasToken, oldv) {
			if(hasToken === false && !initialWatch && $location.path() === '/users-list')  
				$location.path('/login');
			initialWatch = false;
		});

		if(security.isAdmin()) 
			$scope.isAdmin = true;
		else 
			$scope.errorMessage = "unauthorized access";
	}]);