angular.module("login", ["security", "ngStorage", "ngRoute"])
	.config(function($routeProvider){
		$routeProvider
			.when('/login', {
				templateUrl: 'components/login/login.tpl.html',
				controller: 'LoginController'
			});
	})
	.controller("LoginController", ["$scope", "security", "$location","$localStorage", function($scope, security, $location, $localStorage) {
		

		$scope.$watch(function() {
			return security.isAuthenticated() && $localStorage.token !== null && $location.path() === '/login';
		}, function(newv, oldv) {
			if(newv === true)
				$location.path('/home');
		});

		if(security.isAuthenticated() && $localStorage.token !== null) 
			$location.path('/home');

		$scope.username ="";
		$scope.password ="";
		$scope.login = login;
		$scope.loading = false;

		function login() {
			$scope.loading = true;
			security.login($scope.username, $scope.password)
			.then(function(){
				if(security.getCurrentUser() !== null) 
					$scope.loading = false;
			}, function(error) {
				if(error.status === 400) {
					$scope.loading = false;
					$scope.errorMessage  = "Username does not exist!";
				}
				if(error.status === 401) {
					$scope.loading = false;
					$scope.errorMessage = "Invalid password!";
				}
			});
		}
	}]);