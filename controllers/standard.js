var standardControllers = angular.module('standardControllers', []);

standardControllers.controller('UpdateCtrl', ['$scope', '$window', '$timeout', 'navigator', function ($scope, $window, $timeout, navigator) {

	// CATCHING UP TO COUNT STARTED EARLIER IN INDEX.HTML
	$scope.cachedCount = $window.myGlobalCachedCount;
	$scope.updateReady = false;
	$scope.reloadApplication = function() {
		$window.location.href = '/';
	}
        if ($window.applicationCache) {
                $window.applicationCache.addEventListener('noupdate', function(e) {
			$timeout(function() {
				navigator.navigate('/home');
			});
                });
		$window.applicationCache.addEventListener('progress', function() {
			$timeout(function() {
				$scope.cachedCount += 1; 
			});
		});
                $window.applicationCache.addEventListener('cached', function(e) {
			$timeout(function() {
				$scope.updateReady = true;	
			});
                });
                $window.applicationCache.addEventListener('updateready', function(e) {
			$timeout(function() {
				$scope.updateReady = true;	
			});
                });
		if ($window.applicationCache.status == $window.applicationCache.IDLE) {
                	navigator.navigate('/home');	
		}
		if ($window.applicationCache.status == $window.applicationCache.UPDATEREADY) {
                	$scope.updateReady = true;
		}
        } else {
		navigator.navigate('/home');
	}
}]);

standardControllers.controller('ErrorCtrl', ['$scope', '$window', function ($scope, $window) {
	$scope.reloadApplication = function() {
		$window.location.href = '/';
	}
}]);

standardControllers.controller('LoginCtrl', ['$scope', '$timeout', 'navigator', 'blockUI', 'myFirebase', function($scope, $timeout, navigator, blockUI, myFirebase) {
	$scope.failed = false;
	$scope.sent = false;
	$scope.navigate = navigator.navigate;
	$scope.login = function() {
		$scope.sent = false;

		// LEFT IN BLOCKUI AND TIMEOUT
		blockUI.start();
		myFirebase.ref.authWithPassword({
			email: $scope.email,
			password: $scope.password
		}, function(error, authData) {
			$timeout(function() {			
				if (! error) {
					myFirebase.set(myFirebase.ref.child('users').child(authData.uid), authData, function(error) {
						if (! error) {
							myFirebase.update(myFirebase.ref.child('app_users').child(authData.uid), {uid: authData.uid}, function(error) {
								if (! error) {
									navigator.navigate('/home');
								} else {
									navigator.navigate('/error');
								}
							});
						} else {
							navigator.navigate('/error');
						}
					});
				} else {
					$scope.failed = true;
					$scope.password = '';
				}
				blockUI.stop();
			});
		});;
	};
	$scope.reset = function() {
		$scope.failed = false;
		$scope.sent = true;
		myFirebase.ref.resetPassword({
			email : $scope.email
		}, function(error) {
		});	
	}
}]);

standardControllers.controller('AboutCtrl', ['$scope', 'navigator', function($scope, navigator ) {
	$scope.navigate = navigator.navigate;
}]);

standardControllers.controller('UserPasswordCtrl', ['$scope', 'navigator', 'blockUI', '$timeout', 'myFirebase',  function($scope, navigator, blockUI, $timeout, myFirebase) {
	$scope.failed = false;
	$scope.navigate = navigator.navigate;
	var authData = myFirebase.ref.getAuth();
	if (authData != null) {
		$scope.email = authData.password.email;
	} else {
		navigator.navigate('/login');
	}
	$scope.save = function() {

		// CHANGE PASSWORD LEFT IN BLOCKUI AND TIMEOUT
		blockUI.start();
		myFirebase.ref.changePassword({
			email: $scope.email,
			oldPassword : $scope.oldPassword,
			newPassword : $scope.password
		}, function(error) {
			$timeout(function() {
				if (! error) {
					navigator.navigate('/user');
				} else {
					$scope.oldPassword = '';
					$scope.password = '';
					$scope.confirm = '';
					$scope.failed = true;
				}
				blockUI.stop();
			});
		});
	};
}]);

standardControllers.controller('UserCreateCtrl', ['$scope', 'navigator', 'blockUI', '$timeout', 'myFirebase', function($scope, navigator, blockUI, $timeout, myFirebase) {
	$scope.failed = false;
	$scope.navigate = navigator.navigate;
	$scope.save = function() {
	
		// CREATE USER LEFT IN BLOCKUI AND TIMEOUT
		blockUI.start();
		myFirebase.ref.createUser({
			email: $scope.email,
			password: $scope.password
		}, function(error) {
			$timeout(function() {
				if (! error) {
					navigator.navigate('/login');
				} else {
					$scope.password = '';
					$scope.confirm = '';
					$scope.failed = true;
				}
				blockUI.stop();
			});
		});
	};
}]);
