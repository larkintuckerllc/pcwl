var standardControllers = angular.module('standardControllers', []);

standardControllers.controller('UpdateCtrl', ['$scope', '$window', '$timeout', 'navigator', function ($scope, $window, $timeout, navigator) {

	// CATCHING UP TO COUNT STARTED EARLIER IN INDEX.HTML
	$scope.cachedCount = $window.myGlobalCachedCount;
	$scope.updateReady = false;
	$scope.reloadApplication = function() {
		$window.location.href = '/pcwl/';
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
		$window.location.href = '/pcwl/';
	}
}]);

standardControllers.controller('LoginCtrl', ['$scope', '$timeout', 'navigator', 'blockUI','$window', function($scope, $timeout, navigator, blockUI, $window) {
	$scope.failed = false;
	$scope.sent = false;
	$scope.navigate = navigator.navigate;
	var ref = new $window.Firebase('https://pcwl.firebaseio.com');

	// LOGIN
	$scope.login = function() {
		$scope.sent = false;

		// AUTH WITH PASSWORD
		blockUI.start();
		ref.authWithPassword({
			email: $scope.email,
			password: $scope.password
		}, function(error, authData) {
			$timeout(function() {			
				if (error === null) {

					// SET USERS
					blockUI.start();
					ref.child('users').child(authData.uid).set(authData, function(error) {
						$timeout(function() {
							if (error === null) {
	
								// UPDATE APP_USERS
								blockUI.start();
								ref.child('app_users').child(authData.uid).update({uid: authData.uid}, function(error) {
									$timeout(function() {
										if (error === null) {
											navigator.navigate('/home');
										} else {
											navigator.navigate('/error');
										}
										blockUI.stop();
									});
								});
							} else {
								navigator.navigate('/error');
							}
							blockUI.stop();
						});
					});
				} else {
					$scope.failed = true;
					$scope.password = '';
				}
				blockUI.stop();
			});
		});;
	};

	// RESET 
	$scope.reset = function() {
		$scope.failed = false;
		$scope.sent = true;
		ref.resetPassword({
			email : $scope.email
		}, function(error) {
		});	
	}
}]);

standardControllers.controller('AboutCtrl', ['$scope', 'navigator', function($scope, navigator ) {
	$scope.navigate = navigator.navigate;
}]);

standardControllers.controller('UserPasswordCtrl', ['$scope', 'navigator', 'blockUI', '$window', '$timeout', function($scope, navigator, blockUI, $window, $timeout) {
	$scope.failed = false;
	$scope.navigate = navigator.navigate;
	var ref = new $window.Firebase('https://pcwl.firebaseio.com');

	// ON AUTH
	blockUI.start();
	ref.onAuth(function(authData) {
		$timeout(function() {
			if (authData != null) {
				$scope.email = authData.password.email;
			} else {
				navigator.navigate('/login');
			}
			blockUI.stop();
		});
	});

	// SAVE
	$scope.save = function() {

		// CHANGE PASSWORD
		blockUI.start();
		ref.changePassword({
			email: $scope.email,
			oldPassword : $scope.oldPassword,
			newPassword : $scope.password
		}, function(error) {
			$timeout(function() {
				if (error === null) {
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

standardControllers.controller('UserCreateCtrl', ['$scope', 'navigator', 'blockUI', '$window', '$timeout', function($scope, navigator, blockUI, $window, $timeout) {
	$scope.failed = false;
	$scope.navigate = navigator.navigate;
	var ref = new $window.Firebase('https://pcwl.firebaseio.com');

	// SAVE
	$scope.save = function() {
	
		// CREATE USER
		blockUI.start();
		ref.createUser({
			email: $scope.email,
			password: $scope.password
		}, function(error) {
			$timeout(function() {
				if (error === null) {
					navigator.navigate('/login');
				} else {
					$scope.password = '';
					$Scope.confirm = '';
					$scope.failed = true;
				}
				blockUI.stop();
			});
		});
	};
}]);
