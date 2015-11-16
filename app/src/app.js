angular.module("app",["interceptor", "components", "ngRoute"])
	.config(function($routeProvider){
		$routeProvider
			.otherwise({
				redirectTo: '/home'
			});
	})
	.config(function($httpProvider) {
		$httpProvider.interceptors.push('interceptor');
	});