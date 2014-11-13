var homeControllers = angular.module('homeControllers', []);

homeControllers.controller('HomeCtrl', ['$scope', 'blockUI', 'navigator', '$window', '$timeout', function ($scope, blockUI, navigator, $window, $timeout) {
	$scope.navigate = navigator.navigate;
	$scope.menuOpen = false;
	$scope.toggleMenu = function() {
		$scope.menuOpen = ! $scope.menuOpen;
	};
	blockUI.start();
	var ref = new $window.Firebase('https://pcwl.firebaseio.com');
	$scope.logout = function() {
		ref.unauth();
		navigator.navigate('/login');
	};
	ref.onAuth(function(authData) {
		$timeout(function() {
			if (authData != null) {
			} else {
				navigator.navigate('/login');
			}
			blockUI.stop();
		});
	});
}]);
