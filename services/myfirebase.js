var module = angular.module('myFirebaseServices', []);

module.factory('myFirebase', ['blockUI', '$timeout', '$window', function(blockUI, $timeout, $window) {
	var service = {
	};
	service.ref = new $window.Firebase('https://pcwl.firebaseio.com');
	service.onceValue = function(ref, success, error) {
		var hasTimedOut = false;
		var hasCalled = false;
		blockUI.start();
		$timeout(function() {
			hasTimedOut = true;
			if (! hasCalled) {
				error();
				blockUI.stop();
			}
		}, 5000);
		ref.once('value', function(snapshot) {
			// SUCCESS
			hasCalled = true;
			if (! hasTimedOut) {
				$timeout(function() {
					success(snapshot);
					blockUI.stop();
				});
			}
		}, function() {
			// ERROR
			hasCalled = true;
			if (! hasTimedOut) {
				$timeout(function() {
					error();
					blockUI.stop();
				});
			}
		});
	};
	service.push = function(ref, obj, callback) {
		var hasTimedOut = false;
		var hasCalled = false;
		blockUI.start();
		$timeout(function() {
			hasTimedOut = true;
			if (! hasCalled) {
				callback(true);
				blockUI.stop();
			}
		}, 5000);
		return ref.push(obj, function(error) {
			hasCalled = true;
			if (! hasTimedOut) {
				$timeout(function() {
					callback(error);	
					blockUI.stop();
				});
			}
		});
	};
	service.set = function(ref, obj, callback) {
		var hasTimedOut = false;
		var hasCalled = false;
		blockUI.start();
		$timeout(function() {
			hasTimedOut = true;
			if (! hasCalled) {
				callback(true);
				blockUI.stop();
			}
		}, 5000);
		ref.set(obj, function(error) {
			hasCalled = true;
			if (! hasTimedOut) {
				$timeout(function() {
					callback(error);	
					blockUI.stop();
				});
			}
		});
	};
	service.update = function(ref, obj, callback) {
		var hasTimedOut = false;
		var hasCalled = false;
		blockUI.start();
		$timeout(function() {
			hasTimedOut = true;
			if (! hasCalled) {
				callback(true);
				blockUI.stop();
			}
		}, 5000);
		ref.update(obj, function(error) {
			hasCalled = true;
			if (! hasTimedOut) {
				$timeout(function() {
					callback(error);	
					blockUI.stop();
				});
			}
		});
	};
	service.remove = function(ref, callback) {
		var hasTimedOut = false;
		var hasCalled = false;
		blockUI.start();
		$timeout(function() {
			hasTimedOut = true;
			if (! hasCalled) {
				callback(true);
				blockUI.stop();
			}
		}, 5000);
		ref.remove(function(error) {
			hasCalled = true;
			if (! hasTimedOut) {
				$timeout(function() {
					callback(error);	
					blockUI.stop();
				});
			}
		});
	};
	return service;
}]);
