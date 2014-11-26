var module = angular.module('myFirebaseServices', []);

module.service('myFirebase', ['blockUI', '$timeout', '$window', function(blockUI, $timeout, $window) {
	var service = {
	};
	service.ref = new $window.Firebase('https://pcwl.firebaseio.com');
	service.onceValue = function(ref, success, error) {
		blockUI.start();
		ref.once('value', function(snapshot) {
			// SUCCESS
			$timeout(function() {
				success(snapshot);
				blockUI.stop();
			});
		}, function() {
			// ERROR
			$timeout(function() {
				error();
				blockUI.stop();
			});
		});
	};
	service.push = function(ref, obj, callback) {
		blockUI.start();
		return ref.push(obj, function(error) {
			$timeout(function() {
				callback(error);	
				blockUI.stop();
			});
		});
	};
	service.set = function(ref, obj, callback) {
		blockUI.start();
		ref.set(obj, function(error) {
			$timeout(function() {
				callback(error);	
				blockUI.stop();
			});
		});
	};
	service.update = function(ref, obj, callback) {
		blockUI.start();
		ref.update(obj, function(error) {
			$timeout(function() {
				callback(error);	
				blockUI.stop();
			});
		});
	};
	service.remove = function(ref, callback) {
		blockUI.start();
		ref.remove(function(error) {
			$timeout(function() {
				callback(error);	
				blockUI.stop();
			});
		});
	};
	return service;
}]);
