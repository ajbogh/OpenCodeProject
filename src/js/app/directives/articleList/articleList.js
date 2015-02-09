/*angular.module('openCodeProject.directives.articleList', [])
	.directive('articleList', function() {
		return {
			restrict: 'E',
			templateUrl: 'js/app/directives/articleList/articleList.tpl.html',
			link: function($scope, $element, attr){
				$scope.articles = [{
					id: 1,
					title: "Test Article 1"
				},
				{
					id: 2,
					title: "Test Article 2"
				}];
			}
		};
	}
);*/

App.Router.map(function() {
  this.resource('articleList', function() {
    this.route('articles', { path: ':articles' });
  });
});