angular.module("app")
	.directive("post", ["security","Posts", function(security, Posts) {
		return {
			scope: true,
			template: '<div>\
						  <div class="page-header">\
							<h3><small>{{ post.created.hours }} : {{ post.created.minutes }} {{ post.created.date }} from <b> {{ post.author }} </b></small></h3>\
					      </div>\
					      <div class="jumbotron" style="padding:15px;">\
					        {{ post.message }}\
						  </div>\
					   </div>',
			link: function(scope, element, attrs) {
				if(security.isAdmin()) {
					element.html('<div>\
						  <div class="page-header">\
						    <button class="btn btn-default">delete</button>\
							<h3><small>'+scope.post.created.hours+':'+scope.post.created.minutes+' '+scope.post.created.date+' from <b>'+scope.post.author+'</b></small></h3>\
					      </div>\
					      <div class="jumbotron" style="padding:15px;">'
					        + scope.post.message + 
						  '</div>\
					   </div>');
					element.find("button")[0].onclick = function() {
						scope.deletingPost = true;
						element.html('<div><div id="loader" ng-show="deletingPost"></div><div ng-show="deletingPost">deleting post ... </div></div>')
						Posts.delete({ postId : scope.post._id }, 
						function(response) {
							element.html('');
							scope.deletingPost = false;
						}, 
						function(error) {
							console.log(error);
						});
					}
			
				}
			}
		}
	}]);