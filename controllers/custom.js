var homeControllers = angular.module('homeControllers', []);

homeControllers.controller('HomeCtrl', ['$scope', 'blockUI', 'navigator', '$window', '$timeout', 'data', function ($scope, blockUI, navigator, $window, $timeout, data) {
	var appUser;
	var appUserKey;
	$scope.navigate = navigator.navigate;
	$scope.menuOpen = false;
	$scope.toggleMenu = function() {
		$scope.menuOpen = ! $scope.menuOpen;
	};
	$scope.totals = data.totals;
	$scope.plans = data.plans;
	$scope.inRange = data.inRange;
	$scope.plan;
	$scope.log;
	var ref = new $window.Firebase('https://pcwl.firebaseio.com');

	// ON AUTH 
	blockUI.start();
	ref.onAuth(function(authData) {
		$timeout(function() {
			if (authData != null) {

				// ONCE APP_USERS/$USER_ID
				blockUI.start();
				ref.child('app_users').child(authData.uid).once('value', function(snapshot) {

					// SUCCESS
					$timeout(function() {
						appUser = snapshot.val();

						// TODO JET: NAME DEPRICATED
						appUserKey = snapshot.name();
						if (appUser.plan) {
							$scope.plan = appUser.plan;
							if (appUser.log_active) {

								// ONCE LOGS/$LOG_ID
								blockUI.start();
								ref.child('logs').child(appUser.log_active).once('value', function(snapshot) {
									// SUCCESS
									$timeout(function() {
										$scope.log = snapshot.val();

										// TODO JET: NAME DEPRICATED
										$scope.log.key = snapshot.name();
										blockUI.stop();
									});
								}, function() {
									// ERROR
									$timeout(function() {
										navigator.navigate('/error');
										blockUI.stop();
									});
								});
							} else {
								$scope.newLog();
							}
						} else {
							navigator.navigate('/user');
						}
						blockUI.stop();
					});
				}, function() {
					// ERROR
					$timeout(function() {
						navigator.navigate('/error');
						blockUI.stop();
					});
				});
				blockUI.stop();
			} else {
				navigator.navigate('/login');
			}
			blockUI.stop();
		});
	});

	// LOGOUT
	$scope.logout = function() {
		ref.unauth();
		navigator.navigate('/login');
	};

	// NEW LOG
	$scope.newLog = function() {
		var d = new Date();
		$scope.log = {
			app_user: appUserKey,
			points: 0,
			legumes: 0,
			vegetables: 0,
			fruits: 0,
			dairy: 0,
			nuts: 0,
			meats: 0,
			grain: 0,
			time: d.getTime()
		};

		// PUSH LOGS 
		blockUI.start();
		var logRef = ref.child('logs').push($scope.log, function(error) {
			$timeout(function() {
				if (! error) {
					if (! appUser.rel_logs) {
						appUser.rel_logs = {};
					}
					// TODO JET: NAME DEPRICATED
                                        appUser.rel_logs[logRef.name()] = true;
					appUser.log_active = logRef.name();
					$scope.log.key = logRef.name();

					// SET APP_USERS/$USER_ID
					blockUI.start();
					ref.child('app_users').child(appUserKey).set(appUser, function(error) {
						$timeout(function() {
							if (! error) {
								$scope.menuOpen = false;
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
	};
}]);

homeControllers.controller('LogsCtrl', ['$scope', 'blockUI', 'navigator', '$window', '$timeout', function ($scope, blockUI, navigator, $window, $timeout) {
	$scope.navigate = navigator.navigate;
	$scope.logs = [];
	var ref = new $window.Firebase('https://pcwl.firebaseio.com');

	// ON AUTH
	blockUI.start();
	ref.onAuth(function(authData) {
		$timeout(function() {
			if (authData != null) {

				// ONCE APP_USERS/$USER_ID/REL_LOGS
				blockUI.start();
				ref.child('app_users').child(authData.uid).child('rel_logs').once('value', function(snapshot) {
					// SUCCESS
					$timeout(function() {	
						if (snapshot.val()) {	
							var log_keys = Object.keys(snapshot.val());
							var error = false;
							for (var i = 0; i < log_keys.length; i++) {
								if (! error) {

									// ONCE LOGS/$LOG_ID
									blockUI.start();
									ref.child('logs').child(log_keys[i]).once('value', function(snapshot) {
										// SUCCESS
										$timeout(function() {
											var log = snapshot.val();

											// TODO JET: NAME IS DEPRICATED
											log.key = snapshot.name();	
											$scope.logs.push(log);
											blockUI.stop();
										});
									}, function() {
										// ERROR
										$timeout(function() {
											error = true;
											navigator.navigate('/error');
											blockUI.stop();
										});
									});
								}
							}
						}
						blockUI.stop();	
					});
				}, function() {
					// ERROR
					$timeout(function() {
						navigator.navigate('/error');
						blockUI.stop();
					});
				});
				blockUI.stop();
			} else {
				navigator.navigate('/login');
			}
			blockUI.stop();
		});
	});
}]);

homeControllers.controller('LogCtrl', ['$scope', 'blockUI', 'navigator', '$window', '$timeout', '$routeParams', 'data', function ($scope, blockUI, navigator, $window, $timeout, $routeParams, data) {
	var uid;
	var logKey = $routeParams.key;
	$scope.from = $routeParams.from;
	$scope.navigate = navigator.navigate;
	$scope.log = null;
	$scope.totals = data.totals;
	$scope.plans = data.plans;
	$scope.inRange = data.inRange;
	var ref = new $window.Firebase('https://pcwl.firebaseio.com');

	// ON AUTH
	blockUI.start();
	ref.onAuth(function(authData) {
		$timeout(function() {
			if (authData != null) {
				uid = authData.uid;	

				// ONCE APP_USERS/$USER_ID/PLAN
				blockUI.start();
				ref.child('app_users').child(uid).child('plan').once('value', function(snapshot) {
					// SUCCESS
					$timeout(function() {
						$scope.plan = snapshot.val();

// RESETTING INDENT
// ONCE LOGS/$LOG_ID
blockUI.start();
ref.child('logs').child(logKey).once('value', function(snapshot) {

	// SUCCESS
	$timeout(function() {	
		$scope.log = snapshot.val();	
		$scope.choices = [];	
		if ($scope.log.rel_choices) {	
			var choice_keys = Object.keys($scope.log.rel_choices);
			var error = false;
			for (var i = 0; i < choice_keys.length; i++) {
				if (! error) {

					// ONCE CHOICES/$CHOICE_ID
					blockUI.start();
					ref.child('choices').child(choice_keys[i]).once('value', function(snapshot) {
						// SUCCESS
						$timeout(function() {
							var choice = snapshot.val();

							// TODO JET: NAME IS DEPRICATED
							choice.key = snapshot.name();	
							$scope.choices.push(choice);
							blockUI.stop();
						});
					}, function() {
						// ERROR
						$timeout(function() {
							error = true;
							navigator.navigate('/error');
							blockUI.stop();
						});
					});
				}
			}
		}
		blockUI.stop();	
	});
}, function() {

	// ERROR
	$timeout(function() {
		navigator.navigate('/error');
		blockUI.stop();
	});
});
// END RESETTING INDENT

						blockUI.stop();
					});
				}, function() {
					// ERROR
					$timeout(function() {
						navigator.navigate('/error');
						blockUI.stop();
					});
				});
			} else {
				navigator.navigate('/login');
			}
			blockUI.stop();
		});
	});

	// REMOVE
	$scope.remove = function(choiceKey) {
		var choicePosition = $scope.choices.map(function(choice) {
			return choice.key;
		}).indexOf(choiceKey);
		var choice = $scope.choices[choicePosition];
		$scope.log.points -= choice.points;
		if (choice.kind in $scope.log) {
			$scope.log[choice.kind] -= choice.portion;
		}
		$scope.choices.splice(choicePosition,1);
		delete $scope.log.rel_choices[choiceKey];

		// REMOVE CHOICES/$CHOICE_ID
		blockUI.start();
		ref.child('choices').child(choiceKey).remove(function(error) {
			$timeout(function() {
				if (! error) {
	
					// SET LOGS/$LOG_ID
					blockUI.start();
					ref.child('logs').child(logKey).set($scope.log, function(error) {
						$timeout(function() {
							if (! error) {
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
	};
}]);

standardControllers.controller('UserCtrl', ['$scope', 'navigator', 'blockUI', '$window', '$timeout', function($scope, navigator, blockUI, $window, $timeout) {
	var uid;
	$scope.failed = false;
	$scope.navigate = navigator.navigate;
	var ref = new $window.Firebase('https://pcwl.firebaseio.com');

	// ON AUTH
	blockUI.start();
	ref.onAuth(function(authData) {
		$timeout(function() {
			if (authData != null) {
				uid = authData.uid;
				$scope.email = authData.password.email;

				// ONCE APP_USERS/$USER_ID/PLAN
				blockUI.start();
				ref.child('app_users').child(uid).child('plan').once('value', function(snapshot) {

					// SUCCESS
					$timeout(function() {
						$scope.plan = snapshot.val();
						blockUI.stop();
					});
				}, function() {

					// ERROR
					$timeout(function() {
						navigator.navigate('/error');
						blockUI.stop();
					});
				});
				blockUI.stop();
			} else {
				navigator.navigate('/login');
			}
			blockUI.stop();
		});
	});

	// SAVE
	$scope.save = function() {
	
		// SET APP_USERS/$USER_ID/PLAN
		blockUI.start();
		ref.child('app_users').child(uid).child('plan').set($scope.plan, function(error) {
			$timeout(function() {
				if (! error) {
					navigator.navigate('/home');
				} else {
					navigator.navigate('/error');
				}
				blockUI.stop();
			});
		});
	};
}]);

homeControllers.controller('ColumnsCtrl', ['$scope', 'blockUI', 'navigator', '$window', '$timeout', 'data', function ($scope, blockUI, navigator, $window, $timeout, data) {
	$scope.navigate = navigator.navigate;
	$scope.columns = data.columns;
	var ref = new $window.Firebase('https://pcwl.firebaseio.com');

	// ON AUTH
	blockUI.start();
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

homeControllers.controller('ColumnCtrl', ['$scope', 'blockUI', 'navigator', '$window', '$timeout', 'data', '$routeParams', function ($scope, blockUI, navigator, $window, $timeout, data, $routeParams) {
	$scope.columnKey = $routeParams.key;
	$scope.kinds = data.kinds;
	$scope.items = data.items;
	$scope.navigate = navigator.navigate;
	var ref = new $window.Firebase('https://pcwl.firebaseio.com');

	// ON AUTH
	blockUI.start();
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

homeControllers.controller('ItemCtrl', ['$scope', 'blockUI', 'navigator', '$window', '$timeout', 'data', '$routeParams', function ($scope, blockUI, navigator, $window, $timeout, data, $routeParams) {
	var logActive;
	var log;
	$scope.itemKey = $routeParams.key;
	$scope.item = data.items.filter(function(value, index, array) {
		return (value.key === $scope.itemKey);
	})[0];
	$scope.columnKey = data.kinds.filter(function(value, index, array) {
		return (value.key === $scope.item.kind);
	})[0].column;
	$scope.navigate = navigator.navigate;
	var ref = new $window.Firebase('https://pcwl.firebaseio.com');

	// ON AUTH
	blockUI.start();
	ref.onAuth(function(authData) {
		$timeout(function() {
			if (authData != null) {

				// ONCE APP_USERS/$USER_ID/LOG_ACTIVE
				blockUI.start();
				ref.child('app_users').child(authData.uid).child('log_active').once('value', function(snapshot) {
					// SUCCESS
					$timeout(function() {
						if (snapshot.val()) {
							logActive = snapshot.val();

							// ONCE LOGS/$LOG_ID
							blockUI.start();
							ref.child('logs').child(logActive).once('value', function(snapshot) {

								// SUCCESS
								$timeout(function() {
									if (snapshot.val()) {
										log = snapshot.val();
									} else {
										navigator.navigate('/error');
									}
									blockUI.stop();
								});
							}, function(){

								// ERROR
								$timeout(function() {
									navigator.navigate('/error');
									blockUI.stop();
								});
							});
						} else {
							navigator.navigate('/error');
						}
						blockUI.stop();
					});
				}, function() {

					// ERROR
					$timeout(function() {
						navigator.navigate('/error');
						blockUI.stop();
					});
				});
			} else {
				navigator.navigate('/login');
			}
			blockUI.stop();
		});
	});

	// SAVE
	$scope.save = function() {
		var d = new Date();
		var choice = {
			description: $scope.item.description,
			kind: $scope.item.kind,
			points: $scope.item.points * 1,
			portion: 1,
			quality: $scope.item.quality,
			time: d.getTime(),
			log: logActive
		};

		// PUSH CHOICES
		blockUI.start();
		var choiceRef = ref.child('choices').push(choice, function(error) {
			$timeout(function() {
				if (! error) {
					if (! log.rel_choices) {
						log.rel_choices = {};
					}

					// TODO JET: NAME IS DEPRICATED
					log.rel_choices[choiceRef.name()] = true;
					log.points += choice.points;
					if (choice.kind in log) {
						log[choice.kind] += choice.portion;	
					}

					// SET LOGS/$LOG_ID
					blockUI.start();
					ref.child('logs').child(logActive).set(log, function(error) {
						$timeout(function() {
							if (! error) {
								navigator.navigate('/columns/' + $scope.columnKey);
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
	};
}]);
