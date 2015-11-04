angular.module("app")
	.controller("HomeController", ["security", "$localStorage", "$scope","Posts", function(security, $localStorage, $scope, posts) {
		
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
		})

		posts.getAll()
			.then(
			function(response) {
				var posts = response.data;
				for(var i = 0; i < posts.length; i++) {
					var date = new Date(posts[i].created);
					date = { hours: date.getHours(), 
						 minutes: date.getMinutes(),
					     date: addZero(date.getDate())+'-'+ addZero((date.getMonth()+1))+'-'+addZero(date.getFullYear())
						};
					posts[i].created = date;
				}
				$scope.posts = posts.reverse();
			}, 
			function(error) {

			});

		function post() {
			posts.create(security.getCurrentUser(),$scope.comment)
			.then(function(response) {
				var date = new Date(response.data.created);
				date = { hours: date.getHours(), 
						 minutes: date.getMinutes(),
					     date: addZero(date.getDate())+'-'+ addZero((date.getMonth()+1))+'-'+addZero(date.getFullYear())
						};
				var post = response.data;
				post.created = date;
				$scope.posts.unshift(post);
			}, function(error) {
				
			});
		} 

		function addZero(i) {
		    if (i < 10) {
		        i = "0" + i;
		    }
		    return i;
		}
	}]);