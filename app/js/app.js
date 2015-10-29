angular.module("app",["ngRoute"])
	.config(function($routeProvider){
		$routeProvider
			.when('/login', {
				templateUrl: 'view/login.tpl.html',
				controller: 'LoginController'
			})
			.otherwise({
				redirectTo: '/'
			});
	})
	.config(function($httpProvider) {
		$httpProvider.interceptors.push('interceptor');
	});