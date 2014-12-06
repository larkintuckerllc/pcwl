var homeControllers = angular.module('homeControllers', []);

var newLog = function(appUserKey, appUser, myFirebase, success, error) {
	var logKey;
	var d = new Date();
	var log = {
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
	var logRef = myFirebase.push(myFirebase.ref.child('logs'), log, function(l_error) {
		if (! l_error) {
			if (! appUser.rel_logs) {
				appUser.rel_logs = {};
			}

			// TODO JET: NAME DEPRICATED
			appUser.rel_logs[logRef.name()] = true;
			appUser.log_active = logRef.name();
			logKey = logRef.name();
			myFirebase.set(myFirebase.ref.child('app_users').child(appUserKey), appUser, function(l_error) {
				if (! l_error) {
					success(logKey, log);
				} else {
					error();
				}
			});
		} else {
			error();
		}
	});
};

var newWeight = function(weight, appUserKey, appUser, myFirebase, success, error) {
	var weightKey;
	var d = new Date();
	var weight = {
		app_user: appUserKey,
		weight: weight,
		time: d.getTime()
	};	
	var weightRef = myFirebase.push(myFirebase.ref.child('weights'), weight, function(l_error) {
		if (! l_error) {
			if (! appUser.rel_weights) {
				appUser.rel_weights = {};
			}

			// TODO JET: NAME DEPRICATED
			appUser.rel_weights[weightRef.name()] = true;
			weightKey = weightRef.name();
			myFirebase.set(myFirebase.ref.child('app_users').child(appUserKey), appUser, function(l_error) {
				if (! l_error) {
					success(weightKey, weight);
				} else {
					error();
				}
			});
		} else {
			error();
		}
	});
};

homeControllers.controller('HomeCtrl', ['$scope', 'navigator', 'data', 'myFirebase', function ($scope, navigator, data, myFirebase) {
	var appUserKey;
	var appUser;
	$scope.navigate = navigator.navigate;
	$scope.menuOpen = false;
	$scope.toggleMenu = function() {
		$scope.menuOpen = ! $scope.menuOpen;
	};
	$scope.totals = data.totals;
	$scope.plans = data.plans;
	$scope.inRange = data.inRange;
	$scope.plan;
	$scope.logKey;
	$scope.log;
	var authData = myFirebase.ref.getAuth();
	if (authData != null) {
		myFirebase.onceValue(myFirebase.ref.child('app_users').child(authData.uid), function(snapshot) {
			appUser = snapshot.val();

				// TODO JET: NAME DEPRICATED
				appUserKey = snapshot.name();
				if (appUser.plan) {
					$scope.plan = appUser.plan;
					if (appUser.log_active) {
						myFirebase.onceValue(myFirebase.ref.child('logs').child(appUser.log_active), function(snapshot) {

							// TODO JET: NAME DEPRICATED
							$scope.logKey = snapshot.name();
							$scope.log = snapshot.val();
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
		myFirebase.ref.unauth();
		navigator.navigate('/login');
	};
	$scope.newLog = function() {
		newLog(appUserKey, appUser, myFirebase, function(logKey, log) {
			// SUCCESS
			$scope.logKey = logKey;	
			$scope.log = log;
		}, function() {
			// ERROR
			navigator.navigate('/error');

		});
	};
}]);

homeControllers.controller('LogsCtrl', ['$scope', 'navigator', 'myFirebase', function ($scope,  navigator, myFirebase) {
	var appUserKey;
	var appUser;
	$scope.navigate = navigator.navigate;
	$scope.logComparator = function(log) {
		return log.value.time;
	};
	$scope.logs = [];
	$scope.logActiveSameDate = false;
	var authData = myFirebase.ref.getAuth();
	if (authData != null) {
		myFirebase.onceValue(myFirebase.ref.child('app_users').child(authData.uid), function(snapshot) {
			appUserKey = authData.uid;
			appUser = snapshot.val();	
			var d = new Date();
			var logActive = appUser.log_active;
			var logKeys = Object.keys(appUser.rel_logs);
			var error = false;
			for (var i = 0; i < logKeys.length; i++) {
				if (! error) {
					myFirebase.onceValue(myFirebase.ref.child('logs').child(logKeys[i]), function(snapshot) {

						// TODO JET: NAME DEPRICATED
						var logKey = snapshot.name();
						var log = snapshot.val();
						$scope.logs.push({key: logKey, value: log});
						if (logKey == logActive) {
							var logActiveDateTime = new Date(log.time);
							$scope.logActiveSameDate = ((d.getFullYear() == logActiveDateTime.getFullYear()) &&
								(d.getMonth() == logActiveDateTime.getMonth()) &&
								(d.getDate() == logActiveDateTime.getDate())); 
						}
					}, function() {
						error = true;
						navigator.navigate('/error');
					});
				}
			}
		}, function() {
			navigator.navigate('/error');
		});
	} else {
		navigator.navigate('/login');
	}
	$scope.newLog = function() {
		newLog(appUserKey, appUser, myFirebase, function(logKey, log) {
			// SUCCESS
			$scope.logs.push({key: logKey, value: log});
			$scope.logActiveSameDate = true;
		}, function() {
			// ERROR
			navigator.navigate('/error');

		});
	};
}]);

homeControllers.controller('LogCtrl', ['$scope', 'navigator', '$routeParams', 'data', 'myFirebase', function ($scope, navigator, $routeParams, data, myFirebase) {
	var uid;
	$scope.logKey = $routeParams.key;
	$scope.from = $routeParams.from;
	$scope.navigate = navigator.navigate;
	$scope.totals = data.totals;
	$scope.plans = data.plans;
	$scope.inRange = data.inRange;
	$scope.log;
	$scope.plan;
	$scope.active = false;
	$scope.choices = [];
	var authData = myFirebase.ref.getAuth();
	if (authData != null) {
		myFirebase.onceValue(myFirebase.ref.child('app_users').child(authData.uid), function(snapshot) {
			var appUser = snapshot.val();
			$scope.plan = appUser.plan;
			$scope.active = (appUser.log_active == $scope.logKey);

// RESETTING INDENT
myFirebase.onceValue(myFirebase.ref.child('logs').child($scope.logKey), function(snapshot) {
	$scope.log = snapshot.val();	
	if ($scope.log.rel_choices) {	
		var choiceKeys = Object.keys($scope.log.rel_choices);
		var error = false;
		for (var i = 0; i < choiceKeys.length; i++) {
			if (! error) {
				myFirebase.onceValue(myFirebase.ref.child('choices').child(choiceKeys[i]), function(snapshot) {

					// TODO JET: NAME IS DEPRICATED
					var choiceKey = snapshot.name();	
					var choice = snapshot.val();
					$scope.choices.push({key: choiceKey, value: choice});
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
		if ($scope.active) {
			var choicePosition = $scope.choices.map(function(choice) {
				return choice.key;
			}).indexOf(choiceKey);
			var choice = $scope.choices[choicePosition];
			$scope.log.points -= choice.value.points;
			if (choice.value.kind in $scope.log) {
				$scope.log[choice.value.kind] -= choice.value.portion;
			}
			$scope.choices.splice(choicePosition,1);
			delete $scope.log.rel_choices[choiceKey];
			myFirebase.remove(myFirebase.ref.child('choices').child(choiceKey), function(error) {
				if (! error) {
					myFirebase.set(myFirebase.ref.child('logs').child($scope.logKey), $scope.log, function(error) {
						if (! error) {
						} else {
							navigator.navigate('/error');
						}
					});
				} else {
					navigator.navigate('/error');
				}
			});
		}
	};
	$scope.save = function() {
		if ($scope.log.exercise === null) {
			delete $scope.log.exercise;
		}
		if ($scope.log.steps === null) {
			delete $scope.log.steps;
		}
		if ($scope.log.screen === null) {
			delete $scope.log.screen;
		}
		myFirebase.set(myFirebase.ref.child('logs').child($scope.logKey), $scope.log, function(error) {
			if (! error) {
				navigator.navigate('/' + $scope.from);
			} else {
				navigator.navigate('/error');
			}
		});
	};
}]);

standardControllers.controller('UserCtrl', ['$scope', 'navigator', 'myFirebase', function($scope, navigator, myFirebase) {
	var uid;
	$scope.failed = false;
	$scope.navigate = navigator.navigate;
	$scope.email;
	$scope.plan = '';
	var authData = myFirebase.ref.getAuth();
	if (authData != null) {
		uid = authData.uid;
		$scope.email = authData.password.email;
		myFirebase.onceValue(myFirebase.ref.child('app_users').child(uid).child('plan'), function(snapshot) {
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
		myFirebase.set(myFirebase.ref.child('app_users').child(uid).child('plan'), $scope.plan, function(error) {
			if (! error) {
				navigator.navigate('/home');
			} else {
				navigator.navigate('/error');
			}
		});
	};
}]);

homeControllers.controller('ColumnsCtrl', ['$scope', 'navigator', 'data', 'myFirebase', '$routeParams', function ($scope, navigator, data, myFirebase, $routeParams) {
	$scope.navigate = navigator.navigate;
	$scope.columns = data.columns;
	$scope.from = $routeParams.from;
	var authData = myFirebase.ref.getAuth();
	if (authData != null) {
	} else {
		navigator.navigate('/login');
	}
}]);

homeControllers.controller('ColumnCtrl', ['$scope', 'navigator', 'data', '$routeParams', 'myFirebase', function ($scope, navigator, data, $routeParams, myFirebase) {
	$scope.columnKey = $routeParams.key;
	$scope.kinds = data.kinds;
	$scope.items = data.items;
	$scope.navigate = navigator.navigate;
	$scope.from = $routeParams.from;
	var authData = myFirebase.ref.getAuth()
	if (authData != null) {
	} else {
		navigator.navigate('/login');
	}
}]);

homeControllers.controller('ItemCtrl', ['$scope', 'navigator', 'data', '$routeParams', 'myFirebase', function ($scope, navigator, data, $routeParams, myFirebase) {
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
	$scope.from = $routeParams.from;
	var authData = myFirebase.ref.getAuth();
	if (authData != null) {
		myFirebase.onceValue(myFirebase.ref.child('app_users').child(authData.uid).child('log_active'), function(snapshot) {
			if (snapshot.val()) {
				logActive = snapshot.val();
				myFirebase.onceValue(myFirebase.ref.child('logs').child(logActive), function(snapshot) {
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
		var choiceRef = myFirebase.push(myFirebase.ref.child('choices'), choice, function(error) {
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
				myFirebase.set(myFirebase.ref.child('logs').child(logActive), log, function(error) {
					if (! error) {
						navigator.navigate('/columns/' + $scope.columnKey + '/from/' + $scope.from);
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

var buildChartParameters = function(weights) {
	var chartWeights = [
		[],
		[]
	];
	var chartMin = 0;
	var chartMax = 0;
	for (var j = 0; j < weights.length; j++) {
		var jWeightValue = weights[j].value;
		chartWeights[0].push(jWeightValue.time);
		chartWeights[1].push(jWeightValue.weight);
		if (jWeightValue.weight > chartMax) {
			chartMax = jWeightValue.weight + (jWeightValue.weight * 0.05);
		}
		if (jWeightValue.weight < chartMin || chartMin == 0) {
			chartMin = jWeightValue.weight - (jWeightValue.weight * 0.05);
		}
	}
	return {chartWeights: chartWeights, chartMin: chartMin, chartMax: chartMax};
};

homeControllers.controller('WeightsCtrl', ['$scope', 'navigator', 'myFirebase', function ($scope,  navigator, myFirebase) {
	var appUserKey;
	var appUser;
	$scope.navigate = navigator.navigate;
	$scope.weightComparator = function(weight) {
		return weight.value.time;
	};
	$scope.weight = '';
	$scope.weights = [];
        $scope.chartShow = false;
        $scope.chartMin = 0;
        $scope.chartMax = 1;
	$scope.chartWeights = [
		[0, 1],
		[0, 1]
	];
	var authData = myFirebase.ref.getAuth();
	if (authData != null) {
		myFirebase.onceValue(myFirebase.ref.child('app_users').child(authData.uid), function(snapshot) {
			appUserKey = authData.uid;
			appUser = snapshot.val();	
			if (appUser.rel_weights) {
				var weightKeys = Object.keys(appUser.rel_weights);
				var error = false;
				var lastWeightKey = weightKeys[weightKeys.length - 1];
				for (var i = 0; i < weightKeys.length; i++) {
					if (! error) {
						myFirebase.onceValue(myFirebase.ref.child('weights').child(weightKeys[i]), function(snapshot) {

							// TODO JET: NAME DEPRICATED
							var weightKey = snapshot.name();
							var weight = snapshot.val();
							$scope.weights.push({key: weightKey, value: weight});
							if ((weightKey == lastWeightKey) && ($scope.weights.length > 1)) {
								var chartParameters = buildChartParameters($scope.weights);
								$scope.chartMin = chartParameters.chartMin;
								$scope.chartMax = chartParameters.chartMax;
								$scope.chartWeights = chartParameters.chartWeights;
								$scope.chartShow = true;
							}
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
	$scope.newWeight = function() {
		newWeight(Number($scope.weight), appUserKey, appUser, myFirebase, function(weightKey, weight) {
			// SUCCESS
			$scope.weights.push({key: weightKey, value: weight});
			$scope.weight = '';
			if ($scope.weights.length > 1) {
				var chartParameters = buildChartParameters($scope.weights);
				$scope.chartMin = chartParameters.chartMin;
				$scope.chartMax = chartParameters.chartMax;
				$scope.chartWeights = chartParameters.chartWeights;
				$scope.chartShow = true;
			}
		}, function() {
			// ERROR
			navigator.navigate('/error');

		});
	};
        $scope.remove = function(weightKey) {
		var weightPosition = $scope.weights.map(function(weight) {
			return weight.key;
		}).indexOf(weightKey);
		var weight = $scope.weights[weightPosition];
		$scope.weights.splice(weightPosition,1);
		if ($scope.weights.length < 2) {
			$scope.chartShow = false;
			$scope.chartMin = 0;
			$scope.chartMax = 1;
			$scope.chartWeights = [
				[0, 1],
				[0, 1]
			];
		} else {
			var chartParameters = buildChartParameters($scope.weights);
			$scope.chartMin = chartParameters.chartMin;
			$scope.chartMax = chartParameters.chartMax;
			$scope.chartWeights = chartParameters.chartWeights;
		}
		delete appUser.rel_weights[weightKey];
		myFirebase.remove(myFirebase.ref.child('weights').child(weightKey), function(error) {
			if (! error) {
				myFirebase.set(myFirebase.ref.child('app_users').child(appUserKey), appUser, function(error) {
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
