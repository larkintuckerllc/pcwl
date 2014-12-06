var module = angular.module('validatorDirectives', []);

var INTEGER_REGEXP = /^\d+$/;
module.directive('posinteger', function() {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
			ctrl.$validators.posinteger = function(modelValue, viewValue) {
				if (ctrl.$isEmpty(modelValue)) {
					return true;
				}
				if (INTEGER_REGEXP.test(viewValue)) {
					return true;
				}
				return false;
			};
		}
	};
});

var ONEDECIMAL_REGEXP = /^\d+(\.\d{1})?$/;
module.directive('onedecimal', function() {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
			ctrl.$validators.onedecimal = function(modelValue, viewValue) {
				if (ctrl.$isEmpty(modelValue)) {
					return true;
				}
				if (ONEDECIMAL_REGEXP.test(viewValue)) {
					return true;
				}
				return false;
			};
		}
	};
});
