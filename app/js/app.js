angular.module("app",["ngRoute"])
	.config(function($routeProvider){
		$routeProvider
			.when('/login', {
				templateUrl: 'views/login.tpl.html',
				controller: 'LoginController'
			})
			.when('/user-details/:username', {
				templateUrl: 'views/user-details.tpl.html',
				controller: 'UserDetailsController'
			})
			.otherwise({
				redirectTo: '/'
			});
	})
	.config(function($httpProvider) {
		$httpProvider.interceptors.push('interceptor');
	});