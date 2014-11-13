var myApp = angular.module('myApp', [
	'ngRoute',
	'blockUI',
	'firebase',
	'navigatorServices',
	'standardControllers',
	'homeControllers'
])
.config(function(blockUIConfigProvider) {
	blockUIConfigProvider.autoBlock(false);
});
