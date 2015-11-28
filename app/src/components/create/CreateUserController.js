angular.module("create", ["ngStorage", "user", "security", "ngRoute"])
	.config(function($routeProvider){
		$routeProvider
			.when('/create-user', {
				templateUrl: 'components/create/create-user.tpl.html',
				controller: 'CreateUserController'
			})
	})
	.controller("CreateUserController", ["$scope","$localStorage","$location","User","security", function($scope, $localStorage, $location, User, security) {
		
		$scope.username = "";
		$scope.password = "";
		$scope.access = "user";
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
			User.save({},{ username: $scope.username, password: $scope.password, access : $scope.access }, 
				function(response) {
					$scope.loading = false;
					$scope.successMessage = response.username+" added to database";
				}, 
				function(error) {
					$scope.loading = false;
					if(error.status === 401) {
						$scope.errorMessage = "unauthorized access";
					}
				});	
		}
		

	}]);