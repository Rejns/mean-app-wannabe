angular.module("app")
	.directive("userRow", ["Users", function(users) {
		return {
			scope: {
          		user: '='
        	},
			restrict: 'A',
			replace: true,
			template: '<tr><td> {{ user.username }} </td><td> {{ user.access }} </td><td><button>delete</button></td></tr>',
			link : function(scope, element, attrs) {
				element.find('button')[0].onclick = function() {
					users.delete(scope.user.username).then(function(response) {
						element.html('');
					}, function(error) {
					});
					
					
				}
			}
		}
	}]);

angular.module("app").directive("testOk", function(){

    return {
        restrict: 'E',
        template: "<span><strong>{{position.Name}}</strong> ({{position.Code}})</span>",
        replace: true,
        scope: {
          position: '='
        }
    }
});