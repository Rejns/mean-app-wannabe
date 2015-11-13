angular.module("interceptor", ["ngStorage"])
	.factory("interceptor", ["$localStorage", function($localStorage){
		return {
			request: function(config) {
				if($localStorage.token)
					config.headers.Authorization = 'Bearer ' + $localStorage.token;
				return config;
			}
		}
	}]);