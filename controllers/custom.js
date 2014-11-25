var homeControllers = angular.module('homeControllers', []);

homeControllers.controller('HomeCtrl', ['$scope', 'navigator', '$window', 'data', 'myFirebase',  function ($scope, navigator, $window, data, myFirebase) {
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
	var authData = ref.getAuth();
	if (authData != null) {
		myFirebase.onceValue(ref.child('app_users').child(authData.uid), function(snapshot) {
			appUser = snapshot.val();

				// TODO JET: NAME DEPRICATED
				appUserKey = snapshot.name();
				if (appUser.plan) {
					$scope.plan = appUser.plan;
					if (appUser.log_active) {
						myFirebase.onceValue(ref.child('logs').child(appUser.log_active), function(snapshot) {
							$scope.log = snapshot.val();

							// TODO JET: NAME DEPRICATED
							$scope.log.key = snapshot.name();
						}, function() {
							navigator.navigate('/error');
						});
					} else {
						$scope.newLog();
					}
				} else {
					navigator.navigate('/user');
				}
		}, function() {
			navigator.navigate('/error');
		});
	} else {
		navigator.navigate('/login');
	}
	$scope.logout = function() {
		ref.unauth();
		navigator.navigate('/login');
	};
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
		var logRef = myFirebase.push(ref.child('logs'), $scope.log, function(error) {
			if (! error) {
				if (! appUser.rel_logs) {
					appUser.rel_logs = {};
				}

				// TODO JET: NAME DEPRICATED
				appUser.rel_logs[logRef.name()] = true;
				appUser.log_active = logRef.name();
				$scope.log.key = logRef.name();
				myFirebase.set(ref.child('app_users').child(appUserKey), appUser, function(error) {
					if (! error) {
						$scope.menuOpen = false;
					} else {
						navigator.navigate('/error');
					}
				});
			} else {
				navigator.navigate('/error');
			}
		});
	};
}]);

homeControllers.controller('LogsCtrl', ['$scope', 'navigator', '$window', 'myFirebase', function ($scope,  navigator, $window,  myFirebase) {
	$scope.navigate = navigator.navigate;
	$scope.logs = [];
	var ref = new $window.Firebase('https://pcwl.firebaseio.com');
	var authData = ref.getAuth();
	if (authData != null) {
		myFirebase.onceValue(ref.child('app_users').child(authData.uid).child('rel_logs'), function(snapshot) {
			if (snapshot.val()) {	
				var log_keys = Object.keys(snapshot.val());
				var error = false;
				for (var i = 0; i < log_keys.length; i++) {
					if (! error) {
						myFirebase.onceValue(ref.child('logs').child(log_keys[i]), function(snapshot) {
							var log = snapshot.val();

							// TODO JET: NAME IS DEPRICATED
							log.key = snapshot.name();	
							$scope.logs.push(log);
						}, function() {
							error = true;
							navigator.navigate('/error');
						});
					}
				}
			}
		}, function() {
			navigator.navigate('/error');
		});
	} else {
		navigator.navigate('/login');
	}
}]);

homeControllers.controller('LogCtrl', ['$scope', 'navigator', '$window', '$routeParams', 'data', 'myFirebase', function ($scope, navigator, $window, $routeParams, data, myFirebase) {
	var uid;
	var logKey = $routeParams.key;
	$scope.from = $routeParams.from;
	$scope.navigate = navigator.navigate;
	$scope.log = null;
	$scope.totals = data.totals;
	$scope.plans = data.plans;
	$scope.inRange = data.inRange;
	var ref = new $window.Firebase('https://pcwl.firebaseio.com');
	var authData = ref.getAuth();
	if (authData != null) {
		uid = authData.uid;	
		myFirebase.onceValue(ref.child('app_users').child(uid).child('plan'), function(snapshot) {
			$scope.plan = snapshot.val();

// RESETTING INDENT
myFirebase.onceValue(ref.child('logs').child(logKey), function(snapshot) {
	$scope.log = snapshot.val();	
	$scope.choices = [];	
	if ($scope.log.rel_choices) {	
		var choice_keys = Object.keys($scope.log.rel_choices);
		var error = false;
		for (var i = 0; i < choice_keys.length; i++) {
			if (! error) {
				myFirebase.onceValue(ref.child('choices').child(choice_keys[i]), function(snapshot) {
					var choice = snapshot.val();

					// TODO JET: NAME IS DEPRICATED
					choice.key = snapshot.name();	
					$scope.choices.push(choice);
				}, function() {
					error = true;
					navigator.navigate('/error');
				});
			}
		}
	}
}, function() {
	navigator.navigate('/error');
});

// END RESETTING INDENT
		}, function() {
			navigator.navigate('/error');
		});
	} else {
		navigator.navigate('/login');
	}
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
		myFirebase.remove(ref.child('choices').child(choiceKey), function(error) {
			if (! error) {
				myFirebase.set(ref.child('logs').child(logKey), $scope.log, function(error) {
					if (! error) {
					} else {
						navigator.navigate('/error');
					}
				});
			} else {
				navigator.navigate('/error');
			}
		});
	};
}]);

standardControllers.controller('UserCtrl', ['$scope', 'navigator', '$window', 'myFirebase', function($scope, navigator, $window,  myFirebase) {
	var uid;
	$scope.failed = false;
	$scope.navigate = navigator.navigate;
	$scope.plan = '';
	var ref = new $window.Firebase('https://pcwl.firebaseio.com');
	var authData = ref.getAuth();
	if (authData != null) {
		uid = authData.uid;
		$scope.email = authData.password.email;
		myFirebase.onceValue(ref.child('app_users').child(uid).child('plan'), function(snapshot) {
			if (snapshot.val()) {
				$scope.plan = snapshot.val();
			} 
		}, function() {
			navigator.navigate('/error');
		});
	} else {
		navigator.navigate('/login');
	}
	$scope.save = function() {
		myFirebase.set(ref.child('app_users').child(uid).child('plan'), $scope.plan, function(error) {
			if (! error) {
				navigator.navigate('/home');
			} else {
				navigator.navigate('/error');
			}
		});
	};
}]);

homeControllers.controller('ColumnsCtrl', ['$scope', 'navigator', '$window', 'data', function ($scope, navigator, $window, data) {
	$scope.navigate = navigator.navigate;
	$scope.columns = data.columns;
	var ref = new $window.Firebase('https://pcwl.firebaseio.com');
	var authData = ref.getAuth();
	if (authData != null) {
	} else {
		navigator.navigate('/login');
	}
}]);

homeControllers.controller('ColumnCtrl', ['$scope', 'navigator', '$window', 'data', '$routeParams', function ($scope, navigator, $window, data, $routeParams) {
	$scope.columnKey = $routeParams.key;
	$scope.kinds = data.kinds;
	$scope.items = data.items;
	$scope.navigate = navigator.navigate;
	var ref = new $window.Firebase('https://pcwl.firebaseio.com');
	var authData = ref.getAuth()
	if (authData != null) {
	} else {
		navigator.navigate('/login');
	}
}]);

homeControllers.controller('ItemCtrl', ['$scope', 'navigator', '$window', 'data', '$routeParams', 'myFirebase', function ($scope, navigator, $window, data, $routeParams, myFirebase) {
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
	$scope.sliderValue = 4;
	var ref = new $window.Firebase('https://pcwl.firebaseio.com');
	var authData = ref.getAuth();
	if (authData != null) {
		myFirebase.onceValue(ref.child('app_users').child(authData.uid).child('log_active'), function(snapshot) {
			if (snapshot.val()) {
				logActive = snapshot.val();
				myFirebase.onceValue(ref.child('logs').child(logActive), function(snapshot) {
					if (snapshot.val()) {
						log = snapshot.val();
					} else {
						navigator.navigate('/error');
					}
				}, function(){
					navigator.navigate('/error');
				});
			} else {
				navigator.navigate('/error');
			}
		}, function() {
			navigator.navigate('/error');
		});
	} else {
		navigator.navigate('/login');
	}
	$scope.save = function() {
		var d = new Date();
		var choice = {
			description: $scope.item.description,
			kind: $scope.item.kind,
			points: $scope.item.points * $scope.sliderValue * 0.25,
			portion: $scope.sliderValue * 0.25,
			quality: $scope.item.quality,
			time: d.getTime(),
			log: logActive
		};
		var choiceRef = myFirebase.push(ref.child('choices'), choice, function(error) {
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
				myFirebase.set(ref.child('logs').child(logActive), log, function(error) {
					if (! error) {
						navigator.navigate('/columns/' + $scope.columnKey);
					} else {
						navigator.navigate('/error');
					}
				});
			} else {
				navigator.navigate('/error');
			}
		});
	};
}]);
