/*var app = angular.module( 'openCodeProject', [
	//'templates-app',
	//'templates-common',
	//'ngBoilerplate.home',
	//'ngBoilerplate.about',
	'ngRoute',
	'appControllers',
	'openCodeProject.directives.articleList',
	'ui.router',
	'AboutController',
	'ArticlesController'
])

.config( ['$routeProvider', '$locationProvider', function appConfig ($routeProvider, $locationProvider) {
	$routeProvider.when('/',{
		templateUrl: 'partials/index.html',
		controller: 'AppController'
	})
	.when('/projects', {
		templateUrl: 'partials/projects.html',
		controller: 'ProjectsCtrl'
	});
	//.otherwise( { redirectTo: '/' } );

	$locationProvider.html5Mode(true);
}])

.run( function run () {
});

var appControllers = angular.module('appControllers', []);*/

window.App = Ember.Application.create();