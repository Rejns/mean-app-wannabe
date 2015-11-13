angular.module("app")
	.directive("posts", ["Posts","$document","$window","$q", function(Posts, $document, $window, $q) {
		return {
			restrict: 'E',
			scope: {
				posts: '=',
				admin: '='
			},
			transclude: true,
			template: '<div infinite-scroll="loadMore()" infinite-scroll-distance="0"  infinite-scroll-disabled="stopped">\
						<div ng-transclude></div>\
						<div ng-repeat="post in posts">\
						  <button class="btn btn-default" ng-show="admin" ng-click="deletePost(post._id)">delete</button>\
						  <div class="page-header">\
							<h3><small>{{ post.created.hours }} : {{ post.created.minutes }} {{ post.created.date }} from <b> {{ post.author }} </b></small></h3>\
					      </div>\
					      <div class="jumbotron" style="padding:15px;">\
					        {{ post.message }}\
						  </div>\
					   </div>\
					  </div>',
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
					var deferred = $q.defer();
					scope.stopped = true; //prevent more loading until ajax req is completed
					Posts.query({ page: page , limit : limit }, 
					function(response) {
						if(response !== []) {
							scope.stopped = false;
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
						deferred.resolve();
						if(initial === true) {
							initial = false;
							bodyWatcher();	
						}
					}, 
					function(error) {
						console.log(error);
					});
					return deferred.promise;	
			}

			

			function bodyWatcher() {
				var unregister = scope.$watch(function() {
					return angular.element('body')[0].offsetHeight;
				}, 
				function(val) {
					if(val <= $window.innerHeight) {
						unregister();
						scope.loadMore().then(function() {
							bodyWatcher();
						});
					}
				});
			}
		}
		}
	}]);