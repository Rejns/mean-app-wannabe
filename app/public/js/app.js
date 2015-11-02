angular.module("app",["ngRoute","ngStorage"])
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
				templateUrl: 'views/home.tpl.html',
				controller: 'HomeController'
			})
			.when('/users-list', {
				templateUrl: 'views/users-list.tpl.html',
				controller: 'UsersListController'
			})
			.when('/create-user', {
				templateUrl: 'views/create-user.tpl.html',
				controller: 'CreateUserController'
			})
			.otherwise({
				redirectTo: '/home'
			});
	})
	.config(function($httpProvider) {
		$httpProvider.interceptors.push('interceptor');
	});