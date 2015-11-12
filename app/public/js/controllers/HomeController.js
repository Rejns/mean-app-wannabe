angular.module("app")
	.controller("HomeController", ["security", "$localStorage", "$scope","Posts","$q","$document","$window", function(security, $localStorage, $scope, Posts, $q, $document, $window) {
		
		$scope.comment = "write your comment here";
		$scope.post = post;

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

		function addZero(i) {
		    if (i < 10) 
		        i = "0" + i;
		    return i;
		}

		$scope.posts = [];
		var page = 1;
		var limit = 10;
		$scope.stopped = true;
		bodyWatcher();

		function bodyWatcher() {
			var unregister = $scope.$watch(function() {
				return angular.element('body')[0].offsetHeight;
			}, 
			function(val) {
				if(val <= $window.innerHeight) {
					unregister();
					$scope.loadMore().then(function() {
						bodyWatcher();
					});
				}
				else {
					limit = 5;
					$scope.stopped = false;	
				}
			});
		}

		$scope.loadMore = function() {
			var deferred = $q.defer();	
			Posts.query({ page: page , limit : limit }, 
			function(response) {
				if(response.data !== []) {
					var posts = response;
					for(var i = 0; i < posts.length; i++) {
						var date = new Date(posts[i].created);
						date = { hours: addZero(date.getHours()), 
							 minutes: addZero(date.getMinutes()),
						     date: addZero(date.getDate())+'/'+ addZero((date.getMonth()+1))+'/'+addZero(date.getFullYear())
							};
						posts[i].created = date;
					}
					$scope.posts = $scope.posts.concat(posts.reverse());
				}
				page++;	
				deferred.resolve();
			}, 
			function(error) {
				console.log(error);
			});
			return deferred.promise;
		};

	}]);