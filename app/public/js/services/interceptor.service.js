angular.module("app")
	.factory("interceptor", ["$window", function($window){
		return {
			request: function(config) {
				if($window.localStorage.token)
					config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
				return config;
			}
		}
	}]);