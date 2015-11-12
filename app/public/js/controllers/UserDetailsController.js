angular.module("app")
	.controller("UserDetailsController", ["User","security","$location","$scope","$localStorage", function(User, security, $location, $scope, $localStorage) {

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
		User.get({ user : user }, 
		function(response){
			$scope.username = response.username;
			$scope.access = response.access;
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
	