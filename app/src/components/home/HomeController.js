angular.module("home", ['security', 'ngStorage', 'post','posts', "ngRoute"]) 
	.config(function($routeProvider){
		$routeProvider
			.when('/home', {
				templateUrl: 'components/home/home.tpl.html',
				controller: 'HomeController'
			})
	})
	.controller("HomeController", ["security", "$localStorage", "$scope","Posts", function(security, $localStorage, $scope, Posts) {
		
		$scope.comment = "";
		$scope.post = post;
		$scope.isAdmin = security.isAdmin();

		$scope.$watch(function() {
			return security.getCurrentUser();
		}, function(val, old) {
				if(val === null) {
					$scope.user = "please log in to write posts";
				}
				else
					$scope.user = val;
		});

		$scope.isAuth = false;

		$scope.$watch(function() {
			return security.isAuthenticated();
		}, function(val, old) {
			$scope.isAuth = val;
		});

		function post() {
			$scope.creatingPost = true;
			Posts.save({}, { author : security.getCurrentUser(), message : $scope.comment }, 
			function(response) {
				$scope.comment = "";
				$scope.creatingPost = false;
				var date = new Date(response.created);
				date = { hours: addZero(date.getHours()), 
						 minutes: addZero(date.getMinutes()),
					     date: addZero(date.getDate())+'/'+ addZero((date.getMonth()+1))+'/'+addZero(date.getFullYear())
						};
				var post = response;
				post.created = date;
				$scope.posts.unshift(post);
			}, function(error) {
				
			});
		}

		$scope.posts = [];

		function addZero(i) {
		    if (i < 10) 
		        i = "0" + i;
		    return i;
		}	

	}]);