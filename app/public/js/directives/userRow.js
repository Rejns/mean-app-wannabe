angular.module("app")
	.directive("userRow", ["Users", function(users) {
		return {
			scope: true,
			restrict: 'A',
			replace: true,
			template: '<tr><td> {{ user.username }} </td><td> {{ user.access }} </td><td><button>delete</button></td></tr>',
			link : function(scope, element, attrs) {
				var currentUser = scope.user.username;
				element.find('button')[0].onclick = function() {
					element.html("<tr><td><span>delete in progress ...<span><div id='loader'></div></td></tr>");
					users.delete(scope.user.username).then(function(response) {
						console.log(response);
						element.html('<td>'+currentUser+' successfully deleted</td><td></td><td></td>');
					}, function(error) {

					});
					
					
				}
			}
		}
	}]);
