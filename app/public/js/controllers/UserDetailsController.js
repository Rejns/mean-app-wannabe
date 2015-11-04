angular.module("app")
	.controller("UserDetailsController", ["Users","security","$location","$scope","$localStorage", function(users, security, $location, $scope, $localStorage) {

		var initialWatch = true;

		$scope.$watch(function() {	
			return !!$localStorage.token;
		}, function(hasToken, oldv) {
			var re = new RegExp('/user-details/'+'.+');
			if(hasToken === false && !initialWatch && $location.path().match(re) !== null)  
				$location.path('/login');
			initialWatch = false;
		});

		var user = security.getCurrentUser();
		$scope.isAdmin = false;
		
		$scope.loading = true;
		users.getOne(user).then(function(response){
			$scope.username = response.data.username;
			$scope.access = response.data.access;
			$scope.loading = false;
		}, function(error) {
			$scope.loading = false;
			if(error.status === 401)
				$scope.errorMessage = "Unauthorized access!";
			if(error.status === 400) {
				$location.path('/login');
			}
		});
	}]);
	