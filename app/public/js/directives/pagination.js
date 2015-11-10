angular.module('app')
  .directive("pagination", ["$parse", function($parse) {
      return {
        restrict: 'E',
        scope: {
          numPages: '=',
          currentPage: '=',
          list: "=",
          resultsPerPage: '='
        },
        replace: true,
        template: '<ul class="pagination" ng-hide="loading">\
                  <li ng-class="{disabled: noPrevious()}">\
                  <a ng-click="selectPrevious()">Previous</a>\
                  <li ng-hide="forward"><a ng-click=changeDirection()> 1 </a></li>\
                  <li ng-hide="forward"><a > ... </a></li>\
                  </li>\
                  <li ng-repeat="page in pages"\
                  ng-class="{active: isActive(page)}">\
                  <a ng-click="selectPage(page)">{{page}}</a>\
                  </li>\
                  <li ng-show="forward"><a > ... </a></li>\
                  <li ng-show="forward"><a ng-click=changeDirection()>  {{ pageCount }} </a></li>\
                  <li ng-class="{disabled: noNext()}">\
                  <a ng-click="selectNext()">Next</a>\
                  </li>\
                  </ul>',
        link: function(scope, element, attrs) {
              scope.loading = true;
              var initialNumPages = scope.numPages; //save max number of pages in paginator

              var resourceGetter = $parse(attrs.resource);
              var resource = resourceGetter(scope.$parent);
              scope.forward = true;
              scope.pageCount = '?';   
          
              resource.query({ limit: scope.resultsPerPage }, function(success) {
                 scope.list = success.users;
                 scope.loading = false;
                 scope.pageCount = success.pageCount;
                 if(scope.pageCount < scope.numPages)
                  scope.numPages = scope.pageCount;
              }, function(error) {
                  alert(error.status);
              });      
          
              scope.noNext = function() {
                if(scope.currentPage >= scope.pageCount) 
                  return true;
                return false;
              }
              
              scope.noPrevious = function() {
                if(scope.currentPage <= 1) 
                  return true;
                return false;
              }
          
              scope.$watch('numPages', function(value) {
                scope.pages = [];
                if(scope.forward === false) {
                  for(var i = 0; i < value; i++) {
                    scope.pages[i] = scope.pageCount - scope.numPages + i+1;
                  }
                  scope.selectPage(scope.pageCount);
                }
                else {
                 for(var i=1;i<=value;i++) 
                  scope.pages.push(i);
                  scope.selectPage(1);
                }


                if(scope.pageCount < value)
                  scope.numPages = scope.pageCount;
            
              });

              scope.$watch('resultsPerPage', function(val) {
                resource.query({page: scope.currentPage, limit: val}, function(success) {
                    if(success.pageCount < scope.numPages) 
                      scope.numPages = success.pageCount;
                    
                    if(success.pageCount > scope.numPages) 
                      scope.numPages = initialNumPages;
                    
                    scope.pageCount = success.pageCount;
                    scope.list = success.users;
                  }, function(error) {
                    console.log(error);
                  });
              });
           
              scope.isActive = function(page) {
               return scope.currentPage === page;
              };
                
              function isHigher(page, currentPages) {
                for(var i = 0; i < currentPages.length; i++) {
                  if(currentPages[i] >= page)
                    return false;
                }
                return true;
              }

              function isLower(page, currentPages) {
                for(var i = 0; i < currentPages.length; i++) {
                  if(currentPages[i] <= page)
                    return false;
                }
                return true;
              }

              scope.selectNext = function() {
                if ( !scope.noNext() ) {
                  scope.selectPage(scope.currentPage+1);
                  if(isHigher(scope.currentPage, scope.pages)) {
                    for(var i = 0; i < scope.pages.length; i++)
                      scope.pages[i]++;
                    scope.selectPage(scope.pages[scope.pages.length-1]);
                  }

                  resource.query({page: scope.currentPage, limit: scope.resultsPerPage}, function(success) {
                    scope.list = success.users;
                  }, function(error) {
                    console.log(error);
                  });
                }
              };
              
              scope.selectPrevious = function() {
                if( !scope.noPrevious())  {
                  scope.selectPage(scope.currentPage-1);
                    if(isLower(scope.currentPage, scope.pages)) {
                    for(var i = 0; i < scope.pages.length; i++)
                      scope.pages[i]--;
                    scope.selectPage(scope.pages[0]);
                  }   
                }
              }
              
              scope.selectPage = function(page) {
                if ( ! scope.isActive(page) ) {
                  scope.currentPage = page;
                  resource.query({page: scope.currentPage, limit: scope.resultsPerPage}, function(success) {
                      scope.list = success.users;
                    }, function(error) {
                      console.log(error);
                    });
                  }
              }

              scope.changeDirection = function() {
                if(scope.forward === false) {
                  scope.forward = true;
                  for(var i = 0; i < scope.pages.length; i++)
                    scope.pages[i] = i+1;
                  scope.selectPage(1);
                }
                else {
                  scope.forward = false;
                  for(var i = 0; i < scope.pages.length; i++) {
                    scope.pages[i] = scope.pageCount - scope.numPages + i+1;
                  }
                  scope.selectPage(scope.pageCount);
                }
              }
       }
    };
  }]);