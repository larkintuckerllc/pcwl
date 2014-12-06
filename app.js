var myApp = angular.module('myApp', [
	'ngRoute',
	'blockUI',
	'navigatorServices',
	'dataServices',
	'myFirebaseServices',
	'validatorDirectives',
	'controlDirectives',
	'standardControllers',
	'homeControllers'
])
.config(function(blockUIConfigProvider) {
	blockUIConfigProvider.autoBlock(false);
});
