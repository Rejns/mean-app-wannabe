angular.module("app",["ngRoute"])
	.config(function($routeProvider){
		$routeProvider
			.when('/login', {
				templateUrl: 'view/login.tpl.html',
				controller: 'LoginController'
			})
			.when('/user-details/:username', {
				templateUrl: 'view/user-details.tpl.html',
				controller: 'UserDetailsController'
			})
			.otherwise({
				redirectTo: '/'
			});
	})
	.config(function($httpProvider) {
		$httpProvider.interceptors.push('interceptor');
	});