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
			.when('/home', {
				templateUrl: 'views/home.tpl.html'
			})
			.otherwise({
				redirectTo: '/home'
			});
	})
	.config(function($httpProvider) {
		$httpProvider.interceptors.push('interceptor');
	});