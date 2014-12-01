var INTEGER_REGEXP = /^\d+$/;
angular.module('myApp').directive('posinteger', function() {
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
