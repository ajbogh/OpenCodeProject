/*app.controller( 'AppController', ['$scope', '$location', function AppCtrl ( $scope, $location ) {
	$scope.pageTitle = 'The Open Code Project' ;

	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
		if ( angular.isDefined( toState.data.pageTitle ) ) {
			$scope.pageTitle = toState.data.pageTitle + ' | ' + $scope.pageTitle ;
		}
	});

	$scope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error){
		console.log('stateChangeError', toState, error);
	});
}]);*/