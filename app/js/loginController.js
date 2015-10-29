angular.module("app")
	.controller("LoginController", ["$scope", "security", "$window", "Users", function($scope, security, $window, users) {
		$scope.username ="username";
		$scope.password ="password";
		$scope.login = login;
		$scope.getAll = getAll;


		function login() {
			security.login($scope.username, $scope.password)
			.then(function(response) {
				$window.localStorage.token = response.data.token;
				console.log("logged in");
			}, function(error) {
				console.log(error);
			});
		}

		function getAll() {
			users.getAll().then(function(response){
					console.log(response);
					$scope.users = response;
				}, function(error) {
					$scope.users = error;
				});
		}

	}]);