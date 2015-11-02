angular.module("app")
	.controller("HomeController", ["security", "$localStorage", "$scope", function(security, $localStorage, $scope) {
		$scope.$watch(function() {
			return security.getCurrentUser();
		}, function(val, old) {
			console.log(val);
			$scope.user = val;
		});
	}]);