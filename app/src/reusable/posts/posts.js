angular.module("posts", ["post", "infinite-scroll"])
	.directive("posts", ["Posts","$document","$window","$q", function(Posts, $document, $window) {
		return {
			restrict: 'E',
			scope: {
				posts: '=',
				admin: '='
			},
			transclude: true,
			templateUrl: 'reusable/posts/posts.tpl.html',
			link: function(scope, element, attrs) {
		
				var page = 1;
				var limit = 5;
				var initial = true;
				scope.stopped = false;

				function addZero(i) {
				    if (i < 10) 
				        i = "0" + i;
				    return i;
				}

				function findWithAttr(array, attr, value) {
				    for(var i = 0; i < array.length; i += 1) {
				        if(array[i][attr] === value) {
				            return i;
				        }
				    }
				}	

				scope.deletePost = function(id) {
					Posts.delete({ postId: id },
					function(response) {
						scope.posts.splice(findWithAttr(scope.posts, '_id', id), 1);
					}, function(error) {

					});
				}		

				scope.loadMore = function() {
					scope.stopped = true; //prevent more loading until ajax req is completed
					Posts.query({ page: page , limit : limit }, 
					function(response) {
						console.log("response");
						if(response !== []) {	
							var posts = response;
							for(var i = 0; i < posts.length; i++) {
								var date = new Date(posts[i].created);
								date = { hours: addZero(date.getHours()), 
									 minutes: addZero(date.getMinutes()),
								     date: addZero(date.getDate())+'/'+ addZero((date.getMonth()+1))+'/'+addZero(date.getFullYear())
									};
								posts[i].created = date;
							}
							scope.posts = scope.posts.concat(posts.reverse());
						}
						page++;
					}, 
					function(error) {
						console.log(error);
					}).$promise.finally(function() {
						scope.stopped = false;
					});	
				}
			}
		}
	}]);